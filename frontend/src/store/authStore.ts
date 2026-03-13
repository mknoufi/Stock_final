import { create } from "zustand";
import { Platform } from "react-native";
import { secureStorage } from "../services/storage/secureStorage";
import apiClient from "../services/httpClient";
import { useSettingsStore } from "./settingsStore";
import { setUnauthorizedHandler } from "../services/authUnauthorizedHandler";
import { createLogger } from "../services/logging";
import { useNetworkStore } from "./networkStore";
import * as LocalAuthentication from "expo-local-authentication";
import { setUserPreferenceScope } from "../services/userPreferenceScope";

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

type AuthResult = {
  success: boolean;
  message?: string;
  code?: string;
};

type LastLoggedUser = {
  username: string;
  full_name: string;
  has_pin?: boolean;
};

type AuthSessionPayload = {
  access_token: string;
  refresh_token?: string | null;
  user: User;
  has_pin?: boolean;
  biometricPin?: string | null;
};

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
    rememberMe?: boolean,
  ) => Promise<AuthResult>;
  loginWithPin: (
    pin: string,
    username?: string,
  ) => Promise<AuthResult>;
  authenticateWithBiometrics: () => Promise<{
    success: boolean;
    message?: string;
  }>;
  savePinForBiometrics: (pin: string) => Promise<void>;
  getPinForBiometrics: () => Promise<string | null>;
  establishSession: (payload: AuthSessionPayload) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  logoutAll: (
    username?: string,
  ) => Promise<AuthResult>;
  pinSetup: (
    pin: string,
    confirmPin: string,
  ) => Promise<AuthResult>;
  setLoading: (loading: boolean) => void;
  loadStoredAuth: () => Promise<void>;
  lastLoggedUser: LastLoggedUser | null;
  setLastLoggedUser: (user: LastLoggedUser | null) => void;
  clearLastLoggedUser: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "auth_user";
const TOKEN_STORAGE_KEY = "auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const BIOMETRIC_PIN_KEY = "biometric_pin";
const LAST_USER_STORAGE_KEY = "last_logged_user";

const log = createLogger("authStore");
let heartbeatInterval: NodeJS.Timeout | null = null;

const parseAuthError = (
  error: any,
  fallbackMessage: string,
  invalidCredentialsMessage = "Incorrect username or password",
): AuthResult => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  const code = detail?.error || error?.response?.data?.code;
  const apiMessage = detail?.message || error?.response?.data?.message;

  if (status === 409) {
    return {
      success: false,
      code: "AUTH_SESSION_CONFLICT",
      message:
        apiMessage ||
        "This account is already active on another device.",
    };
  }

  if (status === 401) {
    return {
      success: false,
      code: "AUTH_INVALID_CREDENTIALS",
      message: apiMessage || invalidCredentialsMessage,
    };
  }

  if (status === 422) {
    return {
      success: false,
      code: "AUTH_VALIDATION_ERROR",
      message: "Invalid login data. Please check username and password.",
    };
  }

  if (status === 403 && code === "NETWORK_NOT_ALLOWED") {
    return {
      success: false,
      code: "NETWORK_NOT_ALLOWED",
      message: "Network not allowed. Connect to the permitted network.",
    };
  }

  if (error?.code === "ECONNABORTED") {
    return {
      success: false,
      code: "NETWORK_TIMEOUT",
      message: "Server timeout. Please check your connection and try again.",
    };
  }

  if (error?.request && !error?.response) {
    return {
      success: false,
      code: "NETWORK_CONNECTION_ERROR",
      message:
        "Unable to connect to server. Check internet connection and backend status.",
    };
  }

  if (typeof status === "number" && status >= 500) {
    return {
      success: false,
      code: "SERVER_ERROR",
      message: "Server error. Please try again in a moment.",
    };
  }

  return { success: false, message: apiMessage || fallbackMessage, code };
};

const buildLastLoggedUser = (
  user: User,
  hasPinOverride?: boolean,
): LastLoggedUser => ({
  username: user.username,
  full_name: user.full_name,
  has_pin: hasPinOverride ?? user.has_pin,
});

const syncOfflineQueueInBackground = async () => {
  const networkState = useNetworkStore.getState();
  if (!networkState.isOnline) return;

  const { syncOfflineQueue } = await import("../services/syncService");
  syncOfflineQueue({ background: true }).catch((err) => {
    log.warn("Sync after auth failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  lastLoggedUser: null,
  hasValidToken: (): boolean => {
    return !!get().user;
  },

  setLastLoggedUser: async (user: LastLoggedUser | null) => {
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

  establishSession: async ({
    access_token,
    refresh_token,
    user,
    has_pin,
    biometricPin,
  }: AuthSessionPayload) => {
    if (!access_token) {
      throw new Error("Invalid response format: missing access_token");
    }

    const authenticatedUser =
      has_pin === undefined ? user : { ...user, has_pin };
    const lastUser = buildLastLoggedUser(authenticatedUser, has_pin);

    apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    await secureStorage.setItem(TOKEN_STORAGE_KEY, access_token);

    if (refresh_token) {
      await secureStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
    } else {
      await secureStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }

    await secureStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );
    await secureStorage.setItem(
      LAST_USER_STORAGE_KEY,
      JSON.stringify(lastUser),
    );

    if (biometricPin) {
      await secureStorage.setItem(BIOMETRIC_PIN_KEY, biometricPin);
    }

    set({
      user: authenticatedUser,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
      lastLoggedUser: lastUser,
    });

    setUserPreferenceScope(authenticatedUser.id);
    await useSettingsStore.getState().loadSettings();
    get().startHeartbeat();
    await useSettingsStore.getState().syncFromBackend();
    await syncOfflineQueueInBackground();
  },

  login: async (
    username: string,
    password: string,
    _rememberMe?: boolean,
  ): Promise<AuthResult> => {
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
        await get().establishSession({ access_token, refresh_token, user });

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (_error: any) {
      set({ isLoading: false });
      return parseAuthError(
        _error,
        "Login failed",
        "Incorrect username or password",
      );
    }
  },

  loginWithPin: async (
    pin: string,
    username?: string,
  ): Promise<AuthResult> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/login-pin", {
        pin,
        username,
      });

      if (response.data.success && response.data.data) {
        const { access_token, refresh_token, user } = response.data.data;
        const settings = useSettingsStore.getState().settings;
        await get().establishSession({
          access_token,
          refresh_token,
          user,
          has_pin: true,
          biometricPin: settings.biometricAuth ? pin : null,
        });

        return { success: true };
      }

      set({ isLoading: false });
      return {
        success: false,
        message: response.data.message || "Invalid PIN",
      };
    } catch (_error: any) {
      set({ isLoading: false });
      return parseAuthError(_error, "PIN login failed", "Incorrect PIN");
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
          return await get().loginWithPin(
            storedPin,
            get().lastLoggedUser?.username,
          );
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

  setUser: (user: User) => {
    secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setUserPreferenceScope(user.id);
    void useSettingsStore.getState().loadSettings();
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    get().stopHeartbeat();
    try {
      if (
        Platform.OS === "web" ||
        apiClient.defaults.headers.common["Authorization"]
      ) {
        await apiClient.post("/api/auth/logout").catch(() => {});
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

    setUserPreferenceScope(null);
    await useSettingsStore.getState().loadSettings();

    const { clearOfflineQueue } =
      await import("../services/offline/offlineStorage");
    await clearOfflineQueue();
  },

  logoutAll: async (
    username?: string,
  ): Promise<AuthResult> => {
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
    confirmPin: string,
  ): Promise<AuthResult> => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post("/api/auth/pin-setup", {
        pin,
        confirm_pin: confirmPin,
      });
      set({ isLoading: false });
      if (response.data.success) {
        // Persist biometric PIN only when biometric auth is enabled.
        const settings = useSettingsStore.getState().settings;
        if (settings.biometricAuth) {
          await secureStorage.setItem(BIOMETRIC_PIN_KEY, pin);
        }

        // Mark last logged user as PIN-enabled so PIN login mode is available next launch.
        const currentUser = get().user;
        const lastUser = get().lastLoggedUser;
        if (currentUser) {
          const updatedLastUser = {
            username: currentUser.username,
            full_name: currentUser.full_name,
            has_pin: true,
          };
          await secureStorage.setItem(
            LAST_USER_STORAGE_KEY,
            JSON.stringify(updatedLastUser),
          );
          set({
            lastLoggedUser: updatedLastUser,
            user: { ...currentUser, has_pin: true },
          });
        } else if (lastUser) {
          const updatedLastUser = { ...lastUser, has_pin: true };
          await secureStorage.setItem(
            LAST_USER_STORAGE_KEY,
            JSON.stringify(updatedLastUser),
          );
          set({ lastLoggedUser: updatedLastUser });
        }
        return { success: true, message: "PIN updated" };
      }
      return {
        success: false,
        message: response.data.message || "PIN setup failed",
      };
    } catch (_error: any) {
      set({ isLoading: false });
      const detail = _error?.response?.data?.detail;
      return {
        success: false,
        message: detail?.message || "Server error during PIN setup",
      };
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Helper function to check if JWT token is expired
  checkTokenExpired: (token: string): boolean => {
    try {
      const parts = token.split('.');
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
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        setUserPreferenceScope(user.id);
        await useSettingsStore.getState().loadSettings();
        get().startHeartbeat();
        await useSettingsStore.getState().syncFromBackend();
      } else if (Platform.OS === "web") {
        try {
          const response = await apiClient.get("/api/auth/me");
          const payload =
            response.data && typeof response.data === "object" && "data" in response.data
              ? (response.data as { data?: User }).data
              : (response.data as User | null);

          if (payload?.username) {
            await secureStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
            set({
              user: payload,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
            setUserPreferenceScope(payload.id);
            await useSettingsStore.getState().loadSettings();
            get().startHeartbeat();
            await useSettingsStore.getState().syncFromBackend();
            return;
          }
        } catch (_cookieAuthError) {
          // No active browser session; continue to unauthenticated state.
        }

        set({ isLoading: false, isInitialized: true });
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
          error: error instanceof Error ? error.message : String(error)
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
