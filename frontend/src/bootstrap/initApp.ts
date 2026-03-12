import { mmkvStorage } from "../services/mmkvStorage";
import { withTimeout } from "./withTimeout";
import { initMonitoringAndDevTools } from "./initDevTools";
import { initBackendURL } from "./initBackend";
import { initAuthAndSettings } from "./initAuthAndSettings";
import { initMobileRuntime } from "./initMobileRuntime";

export interface InitializeAppOptions {
  fontsLoaded: boolean;
  isDev: boolean;
  loadStoredAuth: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

export interface InitializeAppResult {
  cleanup: () => void;
}

export async function initializeApp(
  options: InitializeAppOptions,
): Promise<InitializeAppResult> {
  const { fontsLoaded, isDev, loadStoredAuth, loadSettings } = options;

  initMonitoringAndDevTools(isDev);

  if (!fontsLoaded && isDev) {
    console.warn("Fonts not loaded yet; continuing bootstrap with fallback fonts");
  }

  try {
    await withTimeout(
      mmkvStorage.initialize(),
      2000,
      "MMKV initialization timeout",
    );
  } catch (e) {
    console.warn("MMKV initialization failed or timed out:", e);
  }

  const [
    backendUrlResult,
    authAndSettingsResult,
    syncResult,
    themeResult,
  ] = await Promise.allSettled([
    initBackendURL(5000),
    initAuthAndSettings(loadStoredAuth, loadSettings),
    withTimeout(
      import("../services/backgroundSync").then(({ registerBackgroundSync }) =>
        registerBackgroundSync(),
      ),
      1000,
      "Background sync timeout",
    ),
    withTimeout(
      import("../services/themeService").then(({ ThemeService }) =>
        ThemeService.initialize(),
      ),
      1000,
      "Theme initialization timeout",
    ),
  ]);

  if (backendUrlResult.status === "rejected" && isDev) {
    console.warn("Backend URL initialization failed:", backendUrlResult.reason);
  }

  if (authAndSettingsResult.status === "rejected") {
    if (isDev) {
      console.warn("Auth/settings initialization failed:", authAndSettingsResult.reason);
    }
  } else {
    const { authResult, settingsResult } = authAndSettingsResult.value;
    if (authResult.status === "rejected" && isDev) {
      console.warn("Auth loading failed:", authResult.reason);
    }
    if (settingsResult.status === "rejected" && isDev) {
      console.warn("Settings loading failed:", settingsResult.reason);
    }
  }

  if (syncResult.status === "rejected" && isDev) {
    console.warn("Background sync failed:", syncResult.reason);
  }
  if (themeResult.status === "rejected" && isDev) {
    console.warn("Theme initialization failed:", themeResult.reason);
  }

  const cleanup = await initMobileRuntime(isDev);
  return { cleanup };
}

