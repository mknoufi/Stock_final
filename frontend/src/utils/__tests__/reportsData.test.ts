import { describe, expect, it } from "@jest/globals";

import { normalizeReports } from "../reportsData";

describe("reportsData", () => {
  it("normalizes wrapped available-reports payload", () => {
    expect(
      normalizeReports({
        success: true,
        data: {
          reports: [
            {
              id: "audit_trail",
              name: "Audit Trail",
              description: "All actions",
              category: "audit",
            },
          ],
        },
      }),
    ).toEqual([
      {
        id: "audit_trail",
        name: "Audit Trail",
        description: "All actions",
        category: "audit",
      },
    ]);
  });

  it("handles direct report arrays and malformed entries safely", () => {
    expect(
      normalizeReports([
        { id: "r1", name: "Report One", category: "SYSTEM" },
        { id: "r2" },
        { name: "missing id" },
        null,
      ]),
    ).toEqual([
      {
        id: "r1",
        name: "Report One",
        description: "",
        category: "system",
      },
      {
        id: "r2",
        name: "r2",
        description: "",
        category: "general",
      },
    ]);
  });

  it("returns empty list for malformed payloads", () => {
    expect(normalizeReports(undefined)).toEqual([]);
    expect(normalizeReports({ success: true, data: {} })).toEqual([]);
    expect(normalizeReports({ reports: {} })).toEqual([]);
  });
});

