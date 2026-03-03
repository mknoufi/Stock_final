import { useEffect, useRef, useCallback } from "react";
import { AppState, Alert, Platform } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { useRouter } from "expo-router";

export const useAutoLogout = (enabled: boolean = true) => {
  const { logout, user } = useAuthStore();
  const sessionTimeout = useSettingsStore((state) => state.settings.sessionTimeout);
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const timeoutMinutes = Number.isFinite(sessionTimeout) ? Math.max(1, sessionTimeout) : 30;
  const inactivityTimeout = timeoutMinutes * 60 * 1000;
  const warningTimeout =
    inactivityTimeout > 2 * 60 * 1000
      ? inactivityTimeout - 2 * 60 * 1000
      : Math.max(5000, Math.floor(inactivityTimeout * 0.8));
  const warningSeconds = Math.max(1, Math.round((inactivityTimeout - warningTimeout) / 1000));
  const canUseWindowListeners =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.addEventListener === "function" &&
    typeof window.removeEventListener === "function";

  const resetTimer = useCallback(() => {
    if (!enabled || !user) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (2 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      Alert.alert(
        "Session Expiring",
        `Your session will expire in ${warningSeconds} seconds due to inactivity. Tap OK to continue.`,
        [
          {
            text: "OK",
            onPress: () => resetTimer(),
          },
        ],
        { cancelable: false }
      );
    }, warningTimeout);

    // Set auto logout timer
    timeoutRef.current = setTimeout(() => {
      Alert.alert(
        "Session Expired",
        "You have been logged out due to inactivity.",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              router.replace("/welcome" as any);
            },
          },
        ],
        { cancelable: false }
      );
    }, inactivityTimeout);
  }, [enabled, user, warningSeconds, warningTimeout, inactivityTimeout, logout, router]);

  useEffect(() => {
    if (!enabled || !user) return;

    // Start timer
    resetTimer();

    // Track app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Check if timeout exceeded while app was in background
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed > inactivityTimeout) {
          logout().finally(() => {
            router.replace("/welcome" as any);
          });
        } else {
          resetTimer();
        }
      }
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      subscription.remove();
    };
  }, [enabled, user, resetTimer, logout, router, inactivityTimeout]);

  // Interaction tracking (Web only)
  useEffect(() => {
    if (!enabled || !user || !canUseWindowListeners) return;

    const onInteraction = () => resetTimer();
    window.addEventListener("mousedown", onInteraction);
    window.addEventListener("keydown", onInteraction);
    window.addEventListener("touchstart", onInteraction, { passive: true });
    window.addEventListener("scroll", onInteraction, { passive: true });

    return () => {
      window.removeEventListener("mousedown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("scroll", onInteraction);
    };
  }, [enabled, user, resetTimer, canUseWindowListeners]);

  return { resetTimer };
};
