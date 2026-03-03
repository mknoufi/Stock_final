import { describe, expect, it } from "@jest/globals";

import { DEFAULT_ADMIN_SETTINGS, normalizeAdminSettingsPayload } from "../adminSettingsData";

describe("adminSettingsData", () => {
  it("normalizes wrapped settings payload", () => {
    const normalized = normalizeAdminSettingsPayload({
      success: true,
      data: {
        api_timeout: "45",
        auto_sync_enabled: true,
        log_level: "warn",
      },
    });

    expect(normalized.api_timeout).toBe(45);
    expect(normalized.auto_sync_enabled).toBe(true);
    expect(normalized.log_level).toBe("WARN");
    expect(normalized.cache_enabled).toBe(DEFAULT_ADMIN_SETTINGS.cache_enabled);
  });

  it("coerces malformed numeric/boolean values to defaults", () => {
    const normalized = normalizeAdminSettingsPayload({
      api_timeout: "not-a-number",
      cache_enabled: "yes",
      max_request_size: -1,
    });

    expect(normalized.api_timeout).toBe(DEFAULT_ADMIN_SETTINGS.api_timeout);
    expect(normalized.cache_enabled).toBe(DEFAULT_ADMIN_SETTINGS.cache_enabled);
    expect(normalized.max_request_size).toBe(DEFAULT_ADMIN_SETTINGS.max_request_size);
  });

  it("returns defaults for missing payload", () => {
    expect(normalizeAdminSettingsPayload(undefined)).toEqual(DEFAULT_ADMIN_SETTINGS);
  });
});

