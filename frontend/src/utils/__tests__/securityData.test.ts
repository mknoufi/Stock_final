import { describe, expect, it } from "@jest/globals";

import {
  normalizeAuditLogs,
  normalizeFailedLogins,
  normalizeIpTracking,
  normalizeSecuritySessions,
  normalizeSecuritySummary,
  normalizeSuspiciousActivity,
} from "../securityData";

describe("securityData", () => {
  it("normalizes wrapped and malformed failed login payloads", () => {
    expect(normalizeFailedLogins(undefined)).toEqual([]);
    expect(
      normalizeFailedLogins({
        success: true,
        data: { failed_logins: [{ username: "alice" }] },
      }),
    ).toEqual([{ username: "alice" }]);
  });

  it("normalizes wrapped suspicious activity payloads", () => {
    expect(
      normalizeSuspiciousActivity({
        success: true,
        data: {
          suspicious_ips: [{ ip_address: "1.1.1.1" }],
          suspicious_users: [{ username: "bob" }],
        },
      }),
    ).toEqual({
      suspicious_ips: [{ ip_address: "1.1.1.1" }],
      suspicious_users: [{ username: "bob" }],
    });
  });

  it("normalizes wrapped sessions payloads", () => {
    expect(
      normalizeSecuritySessions({
        success: true,
        data: { sessions: [{ username: "admin" }] },
      }),
    ).toEqual([{ username: "admin" }]);
  });

  it("normalizes summary and recent events from wrapped payloads", () => {
    expect(
      normalizeSecuritySummary({
        success: true,
        data: {
          summary: { failed_logins: 3, successful_logins: 10 },
          recent_events: [{ action: "login" }],
        },
      }),
    ).toEqual({
      summary: {
        failed_logins: 3,
        successful_logins: 10,
      },
      recent_events: [{ action: "login" }],
    });
  });

  it("normalizes audit logs and ip tracking payloads", () => {
    expect(
      normalizeAuditLogs({
        success: true,
        data: { audit_logs: [{ action: "login" }] },
      }),
    ).toEqual([{ action: "login" }]);

    expect(
      normalizeIpTracking({
        success: true,
        data: { ip_tracking: [{ ip_address: "10.0.0.1" }] },
      }),
    ).toEqual([{ ip_address: "10.0.0.1" }]);
  });
});

