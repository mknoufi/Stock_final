import { describe, expect, it } from "@jest/globals";

import {
  clampHealthScore,
  getHealthScoreFromPayload,
  normalizeDevices,
  normalizeIssues,
  normalizeServices,
} from "../adminControlPanelData";

describe("adminControlPanelData", () => {
  it("normalizes malformed issues payloads to empty array", () => {
    expect(normalizeIssues(undefined)).toEqual([]);
    expect(normalizeIssues(null)).toEqual([]);
    expect(normalizeIssues({ issues: [] })).toEqual([]);
  });

  it("extracts issues from wrapped payloads", () => {
    expect(
      normalizeIssues({
        success: true,
        data: { issues: [{ service: "backend", message: "down" }] },
      }),
    ).toEqual([{ service: "backend", message: "down" }]);
  });

  it("drops malformed issue entries from direct arrays", () => {
    expect(
      normalizeIssues([
        { service: "backend", message: "down" },
        "invalid-entry",
        42,
      ]),
    ).toEqual([{ service: "backend", message: "down" }]);
  });

  it("normalizes malformed devices payloads to empty array", () => {
    expect(normalizeDevices(undefined)).toEqual([]);
    expect(normalizeDevices(null)).toEqual([]);
    expect(normalizeDevices({ devices: [] })).toEqual([]);
  });

  it("extracts devices from wrapped payloads", () => {
    expect(
      normalizeDevices({
        success: true,
        data: { devices: [{ ip_address: "127.0.0.1" }] },
      }),
    ).toEqual([{ ip_address: "127.0.0.1" }]);
  });

  it("drops malformed device entries from direct arrays", () => {
    expect(
      normalizeDevices([{ ip_address: "127.0.0.1" }, "bad", null]),
    ).toEqual([{ ip_address: "127.0.0.1" }]);
  });

  it("normalizes service aliases and missing keys", () => {
    expect(
      normalizeServices({
        backend: { running: true, port: 8001 },
        frontend: { running: false },
        database: { running: true, status: "connected" },
        sqlserver: { running: true, status: "connected" },
      }),
    ).toEqual({
      backend: { running: true, port: 8001 },
      frontend: { running: false },
      mongodb: { running: true, status: "connected" },
      sql_server: { running: true, status: "connected" },
    });
  });

  it("normalizes wrapped services payloads", () => {
    expect(
      normalizeServices({
        success: true,
        data: {
          backend: { running: true },
          frontend: { running: false },
          mongodb: { running: true },
          sql_server: { running: false },
        },
      }),
    ).toEqual({
      backend: { running: true },
      frontend: { running: false },
      mongodb: { running: true },
      sql_server: { running: false },
    });
  });

  it("extracts health score from wrapped payload", () => {
    expect(
      getHealthScoreFromPayload({
        success: true,
        data: { score: 87.5 },
      }),
    ).toBe(87.5);
  });

  it("accepts zero as a valid health score", () => {
    expect(getHealthScoreFromPayload({ data: { score: 0 } })).toBe(0);
  });

  it("returns undefined for malformed health score payload", () => {
    expect(getHealthScoreFromPayload({ data: { score: "bad" } })).toBeUndefined();
  });

  it("clamps health score to 0-100 bounds", () => {
    expect(clampHealthScore(88.4)).toBe(88.4);
    expect(clampHealthScore(120)).toBe(100);
    expect(clampHealthScore(-5)).toBe(0);
    expect(clampHealthScore(NaN)).toBe(0);
  });
});
