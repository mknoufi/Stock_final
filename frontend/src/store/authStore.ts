import { create } from "zustand";
import { secureStorage } from "../services/storage/secureStorage";
import apiClient from "../services/httpClient";
import { useSettingsStore } from "./settingsStore";
import { setUnauthorizedHandler } from "../services/authUnauthorizedHandler";
import { createLogger } from "../services/logging";
import { useNetworkStore } from "./networkStore";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: "staff" | "supervisor" | "admin";
  email?: string;
  is_active: boolean;
  permissions: string[];
  has_pin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  hasValidToken: () => boolean;
  startHeartbeat: () => void;
  stopHeartbeat: () => void;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithPin: (
    pin: string,
  ) => Promise<{ success: boolean; message?: string }>;
  authenticateWithBiometrics: () => Promise<{
    success: boolean;
    message?: string;
  }>;
  savePinForBiometrics: (pin: string) => Promise<void>;
  getPinForBiometrics: () => Promise<string | null>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  loadStoredAuth: () => Promise<void>;
  lastLoggedUser: {
    username: string;
    full_name: string;
    has_pin?: boolean;
  } | null;
  setLastLoggedUser: (user: { username: string; full_name: string } | null) => void;
  clearLastLoggedUser: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "auth_user";
const TOKEN_STORAGE_KEY = "auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const BIOMETRIC_PIN_KEY = "biometric_pin";
const LAST_USER_STORAGE_KEY = "last_logged_user";

const log = createLogger("authStore");
let heartbeatInterval: any = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  lastLoggedUser: null,
  hasValidToken: (): boolean => {
    return !!get().user;
  },

  setLastLoggedUser: async (user) => {
    set({ lastLoggedUser: user });
    if (user) {
      await secureStorage.setItem(LAST_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      await secureStorage.removeItem(LAST_USER_STORAGE_KEY);
    }
  },

  clearLastLoggedUser: async () => {
    await secureStorage.removeItem(LAST_USER_STORAGE_KEY);
    set({ lastLoggedUser: null });
  },

  login: async (
    username: string,
    password: string,
    _rememberMe?: boolean,
  ): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      if (response.data.success && response.data.data) {
        const { access_token, refresh_token, user } = response.data.data;
        if (!access_token) {
          log.error("Login successful but no access_token found in response", {
            dataKeys: Object.keys(response.data.data || {}),
          });
          throw new Error("Invalid response format: missing access_token");
        }

        // Store token for subsequent requests
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;

        // Use SecureStore for sensitive data
        await secureStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        if (refresh_token) {
          await secureStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
        }
        await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

        // Save last logged user for "Hi User" flow
        const lastUser = {
          username: user.username,
          full_name: user.full_name,
          has_pin: user.has_pin,
        };
        await secureStorage.setItem(
          LAST_USER_STORAGE_KEY,
          JSON.stringify(lastUser),
        );

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          lastLoggedUser: lastUser,
        });

        // Start heartbeat check for session validity
        get().startHeartbeat();

        // Sync user settings from backend after successful login
        useSettingsStore.getState().syncFromBackend();

        // Trigger offline queue sync after successful login
        const networkState = useNetworkStore.getState();
        if (networkState.isOnline) {
          log.debug("Online after login, triggering sync");
          const { syncOfflineQueue } = await import("../services/syncService");
          syncOfflineQueue({ background: true }).catch((err) => {
            log.warn("Sync after login failed", {
              error: err instanceof Error ? err.message : String(err),
            });
          });
        } else {
          log.debug("Offline after login, sync will trigger when online");
        }

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (error: unknown) {
      console.error("Login failed:", error);
      set({ isLoading: false });

      let message = "An unexpected error occurred";
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { detail?: string; message?: string };
        };
        request?: unknown;
        message?: string;
      };
      if (axiosError.response) {
        // Server responded with error code
        message =
          axiosError.response.data?.detail ||
          axiosError.response.data?.message ||
          `Server Error (${axiosError.response.status})`;
      } else if (axiosError.request) {
        // Request made but no response (Network Error)
        message =
          "Unable to connect to server. Please check your internet connection and verify the backend is running.";
      } else {
        message = axiosError.message || "An unexpected error occurred";
      }

      return { success: false, message };
    }
  },

  loginWithPin: async (
    pin: string,
  ): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/login-pin", { pin });

      if (response.data.success && response.data.data) {
        const { access_token, refresh_token, user } = response.data.data;

        if (!access_token) {
          log.error("Login successful but no access_token found in response", {
            dataKeys: Object.keys(response.data.data || {}),
          });
          throw new Error("Invalid response format: missing access_token");
        }

        log.debug("PIN Login successful, setting token", {
          tokenPrefix: access_token.substring(0, 10),
        });

        // Store token for subsequent requests
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;

        // Use SecureStore for sensitive data
        await secureStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        if (refresh_token) {
          await secureStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
        }
        await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        // Save PIN for biometrics
        await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);

        // Save last logged user
        const lastUser = { username: user.username, full_name: user.full_name };
        await secureStorage.setItem(LAST_USER_STORAGE_KEY, JSON.stringify(lastUser));

        // Store PIN for biometrics if enabled
        const settings = useSettingsStore.getState().settings;
        if (settings.biometricAuth && pin) {
          await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
        }

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });

        // Start heartbeat check for session validity
        get().startHeartbeat();

        // Sync user settings from backend after successful PIN login
        useSettingsStore.getState().syncFromBackend();

        // Trigger offline queue sync after successful PIN login
        const networkState = useNetworkStore.getState();
        if (networkState.isOnline) {
          log.debug("Online after PIN login, triggering sync");
          const { syncOfflineQueue } = await import("../services/syncService");
          syncOfflineQueue({ background: true }).catch((err) => {
            log.warn("Sync after PIN login failed", {
              error: err instanceof Error ? err.message : String(err),
            });
          });
        } else {
          log.debug("Offline after PIN login, sync will trigger when online");
        }

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Invalid PIN",
      };
    } catch (error: unknown) {
      // Avoid console.error here: React Native LogBox can surface it as a noisy
      // on-screen overlay, and the UI already shows a user-friendly Alert.
      // Also avoid logging the full Axios error object (may contain request data).
      log.debug("PIN login failed", {
        error:
          (error as { message?: string } | null)?.message || "unknown error",
      });
      set({ isLoading: false });

      let message = "Invalid PIN";
      const axiosError = error as {
        response?: { status?: number };
        request?: unknown;
      };
      if (axiosError.response?.status === 401) {
        message = "Invalid PIN. Please try again.";
      } else if (axiosError.request) {
        message = "Unable to connect to server.";
      }

      return { success: false, message };
    }
  },

  authenticateWithBiometrics: async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const storedPin = await secureStorage.getItem(BIOMETRIC_PIN_KEY);
      if (!storedPin) {
        return { success: false, message: "No biometric credentials found" };
      }
      return await get().loginWithPin(storedPin);
    } catch (error) {
      log.error("Biometric authentication failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return { success: false, message: "Biometric authentication failed" };
    }
  },

  setUser: (user: User) => {
    secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  savePinForBiometrics: async (pin: string) => {
    await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
  },

  getPinForBiometrics: async () => {
    return await secureStorage.getItem(BIOMETRIC_PIN_KEY);
  },

  logout: async () => {
    // Stop heartbeat first
    get().stopHeartbeat();

    try {
      // Opportunistic backend logout - only if we have a token
      if (apiClient.defaults.headers.common["Authorization"]) {
        await apiClient.post("/api/auth/logout").catch(() => {});
      }
    } catch (_e) {
      log.debug("Backend logout call failed (not critical)");
    }

    await secureStorage.removeItem(AUTH_STORAGE_KEY);
    await secureStorage.removeItem(TOKEN_STORAGE_KEY);
    await secureStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    await secureStorage.removeItem(BIOMETRIC_PIN_KEY);
    await secureStorage.removeItem(LAST_USER_STORAGE_KEY);
    delete apiClient.defaults.headers.common["Authorization"];

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastLoggedUser: null,
    });

    // Clear offline queue on logout to prevent orphaned data
    const { clearOfflineQueue } = await import("../services/offline/offlineStorage");
    await clearOfflineQueue();
    log.info("Logged out and cleared offline queue");
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  loadStoredAuth: async () => {
    // Session Protection: If already authenticated (e.g. fresh login),
    // do not overwrite state with potentially stale storage data.
    const currentState = get();
    if (currentState.isAuthenticated && currentState.isInitialized) {
      log.debug("loadStoredAuth skipped: session already active and initialized");
      return;
    }

    // Avoid double-loading if already in progress or initialized
    if (currentState.isInitialized) {
      log.debug("loadStoredAuth skipped: already initialized");
      return;
    }

    log.debug("Loading stored auth");
    set({ isLoading: true });
    try {
      const storedUser = await secureStorage.getItem(AUTH_STORAGE_KEY);
      const storedToken = await secureStorage.getItem(TOKEN_STORAGE_KEY);
      log.debug("Stored credentials lookup", {
        hasUser: Boolean(storedUser),
        hasToken: Boolean(storedToken),
      });

      // Race protection: if the user logged in while we were reading storage,
      // never overwrite the active session with "no stored credentials".
      const latestState = get();
      if (latestState.isAuthenticated && latestState.user) {
        log.debug("loadStoredAuth aborted: session became active during load");
        set({ isLoading: false, isInitialized: true });
        return;
      }

      if (storedUser && storedToken) {
        log.debug("Restoring session from storage");
        const user = JSON.parse(storedUser) as User;

        // Ensure header is set BEFORE changing state to trigger bootstrap calls
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });

        // Start session heartbeat check
        get().startHeartbeat();

        // Trigger sync after restoring stored auth
        const networkState = useNetworkStore.getState();
        if (networkState.isOnline) {
          log.debug("Online after restoring stored auth, triggering sync");
          const { syncOfflineQueue } = await import("../services/syncService");
          syncOfflineQueue({ background: true }).catch((err) => {
            log.warn("Sync after restoring stored auth failed", {
              error: err instanceof Error ? err.message : String(err),
            });
          });
        }
      } else {
        // Re-check before clearing state to avoid clobbering a just-created session.
        const stateNow = get();
        if (stateNow.isAuthenticated && stateNow.user) {
          log.debug("loadStoredAuth no-credentials branch skipped: session became active");
          set({
            isLoading: false,
            isInitialized: true,
            lastLoggedUser: currentState.lastLoggedUser,
          });
          return;
        }

        log.debug("No stored credentials found");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          lastLoggedUser: currentState.lastLoggedUser,
        });
      }
    } catch (error) {
      // If a login succeeded while storage lookup failed, keep the active session.
      const stateNow = get();
      if (stateNow.isAuthenticated && stateNow.user) {
        log.warn("loadStoredAuth failed but session is active; keeping current auth", {
          error: (error as { message?: string } | null)?.message || String(error),
        });
        set({ isLoading: false, isInitialized: true });
        return;
      }

      log.warn("Failed to load stored auth", {
        error: (error as { message?: string } | null)?.message || String(error),
      });
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  startHeartbeat: () => {
    if (heartbeatInterval) return;

    log.debug("Starting session heartbeat");
    heartbeatInterval = setInterval(async () => {
      const state = useAuthStore.getState();
      if (!state.isAuthenticated) {
        state.stopHeartbeat();
        return;
      }

      try {
        const response = await apiClient.get("/api/auth/heartbeat");
        if (response.data.success === false || (response.data.data && response.data.data.session_valid === false)) {
          log.warn("Session invalidated by server, logging out", {
            reason: response.data.data?.revocation_reason
          });
          await state.logout();
        }
      } catch (_error) {
        log.debug("Heartbeat failed (network error), will retry");
      }
    }, 60000); // Check every 60 seconds
  },

  stopHeartbeat: () => {
    if (heartbeatInterval) {
      log.debug("Stopping session heartbeat");
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  },
}));

// Register a global unauthorized handler for the HTTP client without creating a circular dependency.
setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});
