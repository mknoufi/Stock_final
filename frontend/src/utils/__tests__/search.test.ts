import { describe, expect, it } from "@jest/globals";

import { includesIgnoreCase } from "../search";

describe("includesIgnoreCase", () => {
  it("matches text case-insensitively", () => {
    expect(includesIgnoreCase("System Auto", "auto")).toBe(true);
    expect(includesIgnoreCase("ITEM-CODE-1", "code")).toBe(true);
  });

  it("returns false safely for nullish or unsupported values", () => {
    expect(includesIgnoreCase(undefined, "abc")).toBe(false);
    expect(includesIgnoreCase(null, "abc")).toBe(false);
    expect(includesIgnoreCase(42, "42")).toBe(true);
    expect(includesIgnoreCase({ id: 1 }, "1")).toBe(false);
  });

  it("treats empty query as true", () => {
    expect(includesIgnoreCase("anything", "")).toBe(true);
    expect(includesIgnoreCase(undefined, "")).toBe(true);
  });
});
