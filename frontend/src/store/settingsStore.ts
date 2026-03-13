import { create } from "zustand";
import { mmkvStorage } from "../services/mmkvStorage";
import { ThemeService, Theme } from "../services/themeService";
import { authApi, UserSettings } from "../services/api/authApi";
import { createLogger } from "../services/logging";
import {
  getScopedStorageKey,
  getScopedStorageKeyCandidates,
} from "../services/userPreferenceScope";

const log = createLogger("settingsStore");
const APP_SETTINGS_KEY = "app_settings";

export interface Settings {
  // Theme
  darkMode: boolean;
  theme: "light" | "dark" | "auto";

  // Notifications
  notificationsEnabled: boolean;
  notificationSound: boolean;
  notificationBadge: boolean;

  // Sync
  autoSyncEnabled: boolean;
  autoSyncInterval: number;
  syncOnReconnect: boolean;

  // Offline
  offlineMode: boolean;
  cacheExpiration: number;
  maxQueueSize: number;

  // Scanner
  scannerVibration: boolean;
  scannerSound: boolean;
  scannerAutoSubmit: boolean;
  scannerTimeout: number;

  // Display
  fontSize: "small" | "medium" | "large";
  fontSizeValue: number; // Numeric font size (12-22)
  primaryColor: string; // Hex color or color id
  primaryColorId: string; // Color palette id (aurora, ocean, etc.)
  showItemImages: boolean;
  showItemPrices: boolean;
  showItemStock: boolean;

  // Data
  exportFormat: "csv" | "json";
  backupFrequency: "daily" | "weekly" | "monthly" | "never";

  // Security
  requireAuth: boolean;
  sessionTimeout: number;
  biometricAuth: boolean;
  operationalMode: "live_audit" | "routine" | "training";

  // Performance
  imageCache: boolean;
  lazyLoading: boolean;
  debounceDelay: number;

  // UI column visibility (staff item detail)
  columnVisibility: {
    mfgDate: boolean;
    expiryDate: boolean;
    serialNumber: boolean;
    mrp: boolean;
  };
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  theme: "auto",
  notificationsEnabled: true,
  notificationSound: true,
  notificationBadge: true,
  autoSyncEnabled: true,
  autoSyncInterval: 15,
  syncOnReconnect: true,
  offlineMode: false,
  cacheExpiration: 24,
  maxQueueSize: 1000,
  scannerVibration: true,
  scannerSound: true,
  scannerAutoSubmit: true,
  scannerTimeout: 30,
  fontSize: "medium",
  fontSizeValue: 16,
  primaryColor: "#0EA5E9",
  primaryColorId: "aurora",
  showItemImages: true,
  showItemPrices: true,
  showItemStock: true,
  exportFormat: "csv",
  backupFrequency: "weekly",
  requireAuth: true,
  sessionTimeout: 30,
  biometricAuth: false,
  operationalMode: "routine",
  imageCache: true,
  lazyLoading: true,
  debounceDelay: 300,
  columnVisibility: {
    mfgDate: true,
    expiryDate: true,
    serialNumber: true,
    mrp: true,
  },
};

const persistSettings = (settings: Settings) => {
  mmkvStorage.setItem(getScopedStorageKey(APP_SETTINGS_KEY), JSON.stringify(settings));
};

interface SettingsState {
  settings: Settings;
  isSyncing: boolean;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  syncFromBackend: () => Promise<void>;
  syncToBackend: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isSyncing: false,

  setSetting: (key, value) => {
    const newSettings = { ...get().settings, [key]: value };
    set({ settings: newSettings });

    // Persist to storage
    persistSettings(newSettings);

    // Handle side effects
    if (key === "theme") {
      ThemeService.setTheme(value as Theme);
    }
  },

  resetSettings: async () => {
    set({ settings: DEFAULT_SETTINGS });
    persistSettings(DEFAULT_SETTINGS);
    ThemeService.setTheme(DEFAULT_SETTINGS.theme as Theme);
  },

  loadSettings: async () => {
    try {
      let mergedSettings = DEFAULT_SETTINGS;
      const activeStorageKey = getScopedStorageKey(APP_SETTINGS_KEY);

      for (const storageKey of getScopedStorageKeyCandidates(APP_SETTINGS_KEY)) {
        const storedSettings = mmkvStorage.getItem(storageKey);
        if (!storedSettings) {
          continue;
        }

        const parsedSettings = JSON.parse(storedSettings);
        mergedSettings = { ...DEFAULT_SETTINGS, ...parsedSettings };

        if (storageKey !== activeStorageKey) {
          persistSettings(mergedSettings);
        }
        break;
      }

      set({ settings: mergedSettings });
      ThemeService.setTheme(mergedSettings.theme as Theme);
    } catch (error) {
      log.warn("Failed to load settings", {
        error: (error as { message?: string } | null)?.message || String(error),
      });
      set({ settings: DEFAULT_SETTINGS });
      ThemeService.setTheme(DEFAULT_SETTINGS.theme as Theme);
    }
  },

  syncFromBackend: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });

    try {
      const backendSettings = await authApi.getUserSettings();
      const currentSettings = get().settings;

      // Map backend fields to frontend settings
      const updatedSettings: Partial<Settings> = {
        ...currentSettings,
        theme: backendSettings.theme as Settings["theme"],
        fontSizeValue: backendSettings.font_size,
        primaryColor: backendSettings.primary_color,
        scannerVibration: backendSettings.haptic_enabled,
        scannerSound: backendSettings.sound_enabled,
        autoSyncEnabled: backendSettings.auto_sync_enabled,
      };

      const mergedSettings = { ...currentSettings, ...updatedSettings };
      set({ settings: mergedSettings });

      // Persist locally
      persistSettings(mergedSettings);

      // Apply theme if changed
      if (backendSettings.theme !== currentSettings.theme) {
        ThemeService.setTheme(mergedSettings.theme as Theme);
      }

      log.debug("Synced settings from backend");
    } catch (error) {
      // Silently fail - use local settings if backend unavailable
      log.warn("Failed to sync from backend", {
        error: (error as { message?: string } | null)?.message || String(error),
      });
    } finally {
      set({ isSyncing: false });
    }
  },

  syncToBackend: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });

    try {
      const currentSettings = get().settings;

      // Map frontend settings to backend schema
      const backendPayload: Partial<UserSettings> = {
        theme: currentSettings.theme,
        font_size: currentSettings.fontSizeValue,
        primary_color: currentSettings.primaryColor,
        haptic_enabled: currentSettings.scannerVibration,
        sound_enabled: currentSettings.scannerSound,
        auto_sync_enabled: currentSettings.autoSyncEnabled,
      };

      await authApi.updateUserSettings(backendPayload);
      log.debug("Synced settings to backend");
    } catch (error) {
      log.warn("Failed to sync to backend", {
        error: (error as { message?: string } | null)?.message || String(error),
      });
    } finally {
      set({ isSyncing: false });
    }
  },
}));
