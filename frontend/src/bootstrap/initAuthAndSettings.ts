import { withTimeout } from "./withTimeout";

export interface AuthAndSettingsInitResult {
  authResult: PromiseSettledResult<void>;
  settingsResult: PromiseSettledResult<void>;
}

export async function initAuthAndSettings(
  loadStoredAuth: () => Promise<void>,
  loadSettings: () => Promise<void>,
): Promise<AuthAndSettingsInitResult> {
  const [authResult, settingsResult] = await Promise.allSettled([
    withTimeout(loadStoredAuth(), 3000, "Auth loading timeout"),
    withTimeout(loadSettings(), 3000, "Settings loading timeout"),
  ]);

  return { authResult, settingsResult };
}

