import { describe, expect, it } from "@jest/globals";

import {
  normalizeMetricsHealth,
  normalizeMetricsStats,
} from "../metricsData";

describe("metricsData", () => {
  it("normalizes metrics stats from services payload", () => {
    const normalized = normalizeMetricsStats({
      timestamp: 123,
      services: {
        total_requests: 1500,
        success_rate: 0.97,
        avg_response_time: 245,
        error_count: 12,
        active_users: 9,
        total_sessions: 24,
        active_sessions: 4,
        total_count_lines: 620,
        pending_approvals: 11,
        total_items: 8000,
        unknown_items: 2,
        top_endpoints: [{ path: "/api/items", count: 123 }],
        recent_errors: [{ type: "timeout", count: 3 }],
      },
    });

    expect(normalized.total_requests).toBe(1500);
    expect(normalized.success_rate).toBeCloseTo(0.97);
    expect(normalized.top_endpoints.length).toBe(1);
    expect(normalized.recent_errors.length).toBe(1);
  });

  it("normalizes success rate if backend sends percentage", () => {
    const normalized = normalizeMetricsStats({
      success_rate: 98,
    });
    expect(normalized.success_rate).toBeCloseTo(0.98);
  });

  it("returns safe defaults for malformed stats", () => {
    const normalized = normalizeMetricsStats(null);
    expect(normalized.total_requests).toBe(0);
    expect(normalized.top_endpoints).toEqual([]);
    expect(normalized.recent_errors).toEqual([]);
  });

  it("normalizes health from readiness payload shape", () => {
    const health = normalizeMetricsHealth({
      mongo: "OK",
      sql: "OFFLINE",
      features: { sql: { status: "OFFLINE" } },
    });

    expect(health.mongodb.status).toBe("connected");
    expect(health.dependencies?.sql_server?.status).toBe("offline");
    expect(health.status).toBe("degraded");
  });

  it("preserves explicit modern health status when available", () => {
    const health = normalizeMetricsHealth({
      status: "healthy",
      mongodb: { status: "connected" },
      dependencies: { sql_server: { status: "healthy" } },
      uptime: 120,
    });

    expect(health.status).toBe("healthy");
    expect(health.uptime).toBe(120);
  });
});

