import { create } from "zustand";
import { secureStorage } from "../services/storage/secureStorage";
import apiClient from "../services/httpClient";
import { useSettingsStore } from "./settingsStore";
import { setUnauthorizedHandler } from "../services/authUnauthorizedHandler";
import { createLogger } from "../services/logging";
import { useNetworkStore } from "./networkStore";
import * as LocalAuthentication from "expo-local-authentication";
import { User } from "../types/user";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  hasValidToken: () => boolean;
  checkTokenExpired: (token: string) => boolean;
  startHeartbeat: () => void;
  stopHeartbeat: () => void;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithPin: (pin: string, username?: string) => Promise<{ success: boolean; message?: string }>;
  authenticateWithBiometrics: () => Promise<{
    success: boolean;
    message?: string;
  }>;
  savePinForBiometrics: (pin: string) => Promise<void>;
  getPinForBiometrics: () => Promise<string | null>;
  clearPinForBiometrics: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  logoutAll: (username?: string) => Promise<{ success: boolean; message?: string }>;
  pinSetup: (pin: string, confirmPin: string) => Promise<{ success: boolean; message?: string }>;
  setLoading: (loading: boolean) => void;
  loadStoredAuth: () => Promise<void>;
  lastLoggedUser: {
    username: string;
    full_name: string;
    has_pin?: boolean;
  } | null;
  setLastLoggedUser: (user: { username: string; full_name: string } | null) => void;
  clearLastLoggedUser: () => Promise<void>;
  setInitialized: (initialized: boolean) => void;
}

const AUTH_STORAGE_KEY = "auth_user";
const TOKEN_STORAGE_KEY = "auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const BIOMETRIC_PIN_KEY = "biometric_pin";
const LAST_USER_STORAGE_KEY = "last_logged_user";

const log = createLogger("authStore");
let heartbeatInterval: NodeJS.Timeout | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  lastLoggedUser: null,
  hasValidToken: (): boolean => {
    return !!get().user;
  },

  setLastLoggedUser: async (
    user: { username: string; full_name: string; has_pin?: boolean } | null
  ) => {
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
    _rememberMe?: boolean
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

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        await secureStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        if (refresh_token) {
          await secureStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
        }
        await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

        const lastUser = {
          username: user.username,
          full_name: user.full_name,
          has_pin: user.has_pin,
        };
        await secureStorage.setItem(LAST_USER_STORAGE_KEY, JSON.stringify(lastUser));

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          lastLoggedUser: lastUser,
        });

        get().startHeartbeat();
        useSettingsStore.getState().syncFromBackend();

        const networkState = useNetworkStore.getState();
        if (networkState.isOnline) {
          const { syncOfflineQueue } = await import("../services/syncService");
          syncOfflineQueue({ background: true }).catch((err) => {
            log.warn("Sync after login failed", { error: err.message });
          });
        }

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (_error: any) {
      set({ isLoading: false });
      const message =
        _error.response?.data?.detail?.message || _error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  },

  loginWithPin: async (
    pin: string,
    username?: string
  ): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/login-pin", {
        pin,
        username,
      });

      if (response.data.success && response.data.data) {
        const { access_token, refresh_token, user } = response.data.data;
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        await secureStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        if (refresh_token) {
          await secureStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
        }
        await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

        const lastUser = {
          username: user.username,
          full_name: user.full_name,
          has_pin: true,
        };
        await secureStorage.setItem(LAST_USER_STORAGE_KEY, JSON.stringify(lastUser));

        const settings = useSettingsStore.getState().settings;
        if (settings.biometricAuth && pin) {
          await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
        }

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          lastLoggedUser: lastUser,
        });

        get().startHeartbeat();
        useSettingsStore.getState().syncFromBackend();

        const networkState = useNetworkStore.getState();
        if (networkState.isOnline) {
          const { syncOfflineQueue } = await import("../services/syncService");
          syncOfflineQueue({ background: true }).catch((err) => log.warn("Sync error", err));
        }

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Invalid PIN",
      };
    } catch (_error: any) {
      set({ isLoading: false });
      const message =
        _error.response?.data?.detail?.message ||
        _error.response?.data?.message ||
        "PIN login failed";
      return { success: false, message };
    }
  },

  authenticateWithBiometrics: async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return {
          success: false,
          message: "Biometric authentication is not available on this device.",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock with Biometrics",
        fallbackLabel: "Use PIN",
      });

      if (result.success) {
        const storedPin = await secureStorage.getItem(BIOMETRIC_PIN_KEY);
        if (storedPin) {
          return await get().loginWithPin(storedPin, get().lastLoggedUser?.username);
        }
        return {
          success: false,
          message: "No PIN stored for biometric login.",
        };
      }

      return { success: false, message: "Authentication cancelled." };
    } catch (_error) {
      return { success: false, message: "Biometric authentication error." };
    }
  },

  savePinForBiometrics: async (pin: string) => {
    await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
  },

  getPinForBiometrics: async () => {
    return await secureStorage.getItem(BIOMETRIC_PIN_KEY);
  },

  clearPinForBiometrics: async () => {
    await secureStorage.removeItem(BIOMETRIC_PIN_KEY);
  },

  setUser: (user: User) => {
    secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    get().stopHeartbeat();
    try {
      if (apiClient.defaults.headers.common["Authorization"]) {
        const refreshToken = await secureStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
        await apiClient
          .post("/api/auth/logout", refreshToken ? { refresh_token: refreshToken } : {})
          .catch(() => {});
      }
    } catch (_) {}

    await secureStorage.removeItem(AUTH_STORAGE_KEY);
    await secureStorage.removeItem(TOKEN_STORAGE_KEY);
    await secureStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    await secureStorage.removeItem(BIOMETRIC_PIN_KEY);
    delete apiClient.defaults.headers.common["Authorization"];

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { clearOfflineQueue } = await import("../services/offline/offlineStorage");
    await clearOfflineQueue();
  },

  logoutAll: async (username?: string): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/sessions/logout-all", {
        username,
      });
      set({ isLoading: false });
      return { success: response.data.success, message: response.data.message };
    } catch (_error) {
      set({ isLoading: false });
      return { success: false, message: "Logout All failed" };
    }
  },

  pinSetup: async (
    pin: string,
    confirmPin: string
  ): Promise<{ success: boolean; message?: string }> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/pin-setup", {
        pin,
        confirm_pin: confirmPin,
      });
      set({ isLoading: false });
      if (response.data.success) {
        // Keep in-memory/auth-storage user in sync so PIN prompts stop immediately.
        const currentUser = get().user;
        if (currentUser && !currentUser.has_pin) {
          const updatedUser = { ...currentUser, has_pin: true };
          set({ user: updatedUser });
          await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        }

        // Update lastLoggedUser to indicate PIN is now set
        const currentLastUser = get().lastLoggedUser;
        if (currentLastUser) {
          const updatedLastUser = { ...currentLastUser, has_pin: true };
          set({ lastLoggedUser: updatedLastUser });
          await secureStorage.setItem("last_logged_user", JSON.stringify(updatedLastUser));
        }

        const settings = useSettingsStore.getState().settings;
        if (settings.biometricAuth) {
          await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
        } else {
          await secureStorage.removeItem(BIOMETRIC_PIN_KEY);
        }
        return { success: true, message: "PIN updated" };
      }
      return {
        success: false,
        message: response.data.message || "PIN setup failed",
      };
    } catch (_error) {
      set({ isLoading: false });
      return { success: false, message: "Server error during PIN setup" };
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),

  // Helper function to check if JWT token is expired
  checkTokenExpired: (token: string): boolean => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false; // Not a valid JWT

      const payload = parts[1] ? JSON.parse(atob(parts[1])) : null;
      if (!payload || !payload.exp) return false;

      const now = Math.floor(Date.now() / 1000);

      // Remove aggressive 30-second buffer - let server handle expiration
      // Only consider expired if actually expired
      return payload.exp < now;
    } catch {
      return false; // If we can't parse, assume it's valid
    }
  },

  loadStoredAuth: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      const storedUser = await secureStorage.getItem(AUTH_STORAGE_KEY);
      const storedToken = await secureStorage.getItem(TOKEN_STORAGE_KEY);
      const storedLastUser = await secureStorage.getItem(LAST_USER_STORAGE_KEY);

      if (storedLastUser) {
        set({ lastLoggedUser: JSON.parse(storedLastUser) });
      }

      if (storedUser && storedToken) {
        // Check if token is expired
        const isExpired = get().checkTokenExpired(storedToken);
        if (isExpired) {
          log.warn("Stored token is expired, clearing auth state");
          await get().logout();
          set({ isLoading: false, isInitialized: true });
          return;
        }

        const user = JSON.parse(storedUser) as User;
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        get().startHeartbeat();
      } else {
        set({ isLoading: false, isInitialized: true });
      }
    } catch (_error) {
      set({ isLoading: false, isInitialized: true });
    }
  },

  startHeartbeat: () => {
    if (heartbeatInterval) return;

    let consecutiveFailures = 0;
    const MAX_FAILURES = 3; // Allow 3 failures before logout

    heartbeatInterval = setInterval(async () => {
      if (!get().isAuthenticated) {
        get().stopHeartbeat();
        return;
      }

      try {
        const response = await apiClient.get("/api/auth/heartbeat");
        consecutiveFailures = 0; // Reset on success

        if (
          response.data.success === false ||
          (response.data.data && response.data.data.session_valid === false)
        ) {
          await get().logout();
        }
      } catch (error) {
        consecutiveFailures++;
        log.warn("Heartbeat failed", {
          failureCount: consecutiveFailures,
          error: error instanceof Error ? error.message : String(error),
        });

        // Only logout after multiple consecutive failures
        if (consecutiveFailures >= MAX_FAILURES) {
          log.error("Heartbeat failed multiple times, logging out");
          await get().logout();
        }
      }
    }, 300000); // 5 minutes instead of 60 seconds
  },

  stopHeartbeat: () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  },
}));

setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});
