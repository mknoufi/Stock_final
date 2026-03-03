import { describe, expect, it } from "@jest/globals";

import {
  asRecordArray,
  formatInr,
  getApiErrorMessage,
  toCsvString,
  toParamString,
} from "../itemLiveDetailUtils";

describe("itemLiveDetailUtils", () => {
  it("decodes CSV text from Blob payload", async () => {
    const blob = new Blob(["item_code,count\nABC,1"], { type: "text/csv" });
    await expect(toCsvString(blob)).resolves.toBe("item_code,count\nABC,1");
  });

  it("returns direct string payload unchanged", async () => {
    await expect(toCsvString("a,b\n1,2")).resolves.toBe("a,b\n1,2");
  });

  it("formats invalid currency values as zero", () => {
    expect(formatInr(undefined)).toBe("\u20B90");
    expect(formatInr("invalid")).toBe("\u20B90");
  });

  it("normalizes route params from string arrays", () => {
    expect(toParamString("ABC")).toBe("ABC");
    expect(toParamString(["ABC", "DEF"])).toBe("ABC");
    expect(toParamString("   ")).toBeUndefined();
  });

  it("filters malformed entries from record arrays", () => {
    expect(asRecordArray([{ id: 1 }, "bad", 42, null])).toEqual([{ id: 1 }]);
    expect(asRecordArray(undefined)).toEqual([]);
  });

  it("extracts API error messages from nested response shapes", () => {
    expect(
      getApiErrorMessage(
        {
          success: false,
          error: { message: "Live detail fetch failed" },
        },
        "fallback",
      ),
    ).toBe("Live detail fetch failed");

    expect(
      getApiErrorMessage(
        {
          response: {
            data: {
              detail: { message: "Server said no" },
            },
          },
        },
        "fallback",
      ),
    ).toBe("Server said no");

    expect(getApiErrorMessage({}, "fallback")).toBe("fallback");
  });
});
