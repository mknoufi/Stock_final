import { initAuthAndSettings } from "./initAuthAndSettings";

describe("initAuthAndSettings", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns fulfilled results when both loaders succeed", async () => {
    const result = await initAuthAndSettings(
      async () => undefined,
      async () => undefined,
    );

    expect(result.authResult.status).toBe("fulfilled");
    expect(result.settingsResult.status).toBe("fulfilled");
  });

  it("marks loaders as rejected on timeout", async () => {
    const never = () => new Promise<void>(() => {});
    const pending = initAuthAndSettings(never, never);

    jest.advanceTimersByTime(3000);
    const result = await pending;

    expect(result.authResult.status).toBe("rejected");
    expect(result.settingsResult.status).toBe("rejected");
  });
});

