import { describe, expect, it } from "@jest/globals";

import { formatBatchMrp } from "../batchMeta";

describe("formatBatchMrp", () => {
  it("formats numeric MRP with rupee symbol", () => {
    expect(formatBatchMrp(149.5)).toBe("₹149.50");
  });

  it("returns dash for missing or invalid MRP", () => {
    expect(formatBatchMrp(undefined)).toBe("-");
    expect(formatBatchMrp(null)).toBe("-");
    expect(formatBatchMrp("abc")).toBe("-");
  });
});

