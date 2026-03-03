import { describe, expect, it } from "@jest/globals";

import { buildAdminSessionStats, normalizeAdminSessions } from "../adminDashboardData";

describe("adminDashboardData", () => {
  it("normalizes mixed session identifiers and status casing", () => {
    expect(
      normalizeAdminSessions([
        { id: "s1", status: "OPEN", total_items: 5, total_variance: 0 },
        { session_id: "s2", status: "active", total_items: "2", total_variance: "1.5" },
        { _id: "mongo-id", status: "reconcile", total_items: null, total_variance: null },
      ]),
    ).toEqual([
      { id: "s1", status: "OPEN", total_items: 5, total_variance: 0 },
      { id: "s2", status: "ACTIVE", total_items: 2, total_variance: 1.5 },
      { id: "mongo-id", status: "RECONCILE", total_items: 0, total_variance: 0 },
    ]);
  });

  it("builds stable dashboard stats from normalized sessions", () => {
    const sessions = normalizeAdminSessions([
      { id: "s1", status: "open", total_items: 5, total_variance: 0 },
      { id: "s2", status: "ACTIVE", total_items: 2, total_variance: -1 },
      { id: "s3", status: "closed", total_items: 3, total_variance: 0 },
    ]);

    expect(buildAdminSessionStats(sessions)).toEqual({
      totalSessions: 3,
      open: 2,
      varianceSessions: 1,
      totalItems: 10,
    });
  });
});

