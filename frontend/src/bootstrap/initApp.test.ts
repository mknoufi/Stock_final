import { initializeApp } from "./initApp";
import { initBackendURL } from "./initBackend";
import { initAuthAndSettings } from "./initAuthAndSettings";
import { initMobileRuntime } from "./initMobileRuntime";
import { initMonitoringAndDevTools } from "./initDevTools";

jest.mock("../services/mmkvStorage", () => ({
  mmkvStorage: {
    initialize: jest.fn(async () => undefined),
  },
}));

jest.mock("../services/backgroundSync", () => ({
  registerBackgroundSync: jest.fn(async () => undefined),
}));

jest.mock("../services/themeService", () => ({
  ThemeService: {
    initialize: jest.fn(async () => undefined),
  },
}));

jest.mock("./initDevTools", () => ({
  initMonitoringAndDevTools: jest.fn(),
}));

jest.mock("./initBackend", () => ({
  initBackendURL: jest.fn(async () => undefined),
}));

jest.mock("./initAuthAndSettings", () => ({
  initAuthAndSettings: jest.fn(async () => ({
    authResult: { status: "fulfilled", value: undefined },
    settingsResult: { status: "fulfilled", value: undefined },
  })),
}));

jest.mock("./initMobileRuntime", () => ({
  initMobileRuntime: jest.fn(async () => () => undefined),
}));

describe("initializeApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (jest.isMockFunction(console.warn)) {
      (console.warn as jest.Mock).mockImplementation(() => undefined);
    } else {
      jest.spyOn(console, "warn").mockImplementation(() => undefined);
    }
    if (jest.isMockFunction(console.error)) {
      (console.error as jest.Mock).mockImplementation(() => undefined);
    } else {
      jest.spyOn(console, "error").mockImplementation(() => undefined);
    }
  });

  it("continues startup when non-critical steps fail", async () => {
    (initBackendURL as jest.Mock).mockRejectedValueOnce(new Error("backend timeout"));
    (initAuthAndSettings as jest.Mock).mockResolvedValueOnce({
      authResult: { status: "rejected", reason: new Error("auth timeout") },
      settingsResult: { status: "fulfilled", value: undefined },
    });

    const result = await initializeApp({
      fontsLoaded: true,
      isDev: true,
      loadStoredAuth: async () => undefined,
      loadSettings: async () => undefined,
    });

    expect(initMonitoringAndDevTools).toHaveBeenCalled();
    expect(typeof result.cleanup).toBe("function");
  });

  it("fails startup when mobile runtime initialization fails", async () => {
    (initMobileRuntime as jest.Mock).mockRejectedValueOnce(new Error("mobile runtime failed"));

    await expect(
      initializeApp({
        fontsLoaded: true,
        isDev: true,
        loadStoredAuth: async () => undefined,
        loadSettings: async () => undefined,
      }),
    ).rejects.toThrow("mobile runtime failed");
  });
});
