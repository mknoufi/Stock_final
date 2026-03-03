import { describe, expect, it } from "@jest/globals";

import { normalizeLogEntries } from "../adminLogsData";

describe("adminLogsData", () => {
  it("returns empty array for non-array payloads", () => {
    expect(normalizeLogEntries(undefined)).toEqual([]);
    expect(normalizeLogEntries(null)).toEqual([]);
    expect(normalizeLogEntries({})).toEqual([]);
  });

  it("normalizes valid log entries and drops unsupported values", () => {
    const normalized = normalizeLogEntries([
      { level: "INFO", message: "ok", timestamp: "2026-01-01T00:00:00Z" },
      "bad-entry",
      { level: "ERROR" },
    ]);

    expect(normalized.length).toBe(2);
    expect(normalized[0]).toEqual(
      expect.objectContaining({
        level: "INFO",
        message: "ok",
      }),
    );
    expect(normalized[1]).toEqual(
      expect.objectContaining({
        level: "ERROR",
      }),
    );
  });
});

