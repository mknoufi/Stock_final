import { describe, expect, it } from "@jest/globals";

import {
  DEFAULT_SQL_SERVER_CONFIG,
  normalizeSqlConnectionTestPayload,
  normalizeSqlServerConfigPayload,
  toSqlServerConfigRequest,
} from "../adminSqlConfigData";

describe("adminSqlConfigData", () => {
  it("normalizes wrapped SQL config payload with user field", () => {
    const config = normalizeSqlServerConfigPayload({
      success: true,
      data: {
        host: "10.0.0.1",
        port: "1433",
        database: "ERP",
        user: "stockapp",
      },
    });

    expect(config).toEqual({
      host: "10.0.0.1",
      port: 1433,
      database: "ERP",
      user: "stockapp",
      password: "",
    });
  });

  it("supports legacy username alias and defaults invalid values", () => {
    const config = normalizeSqlServerConfigPayload({
      data: {
        host: "sql.local",
        database: "warehouse",
        username: "legacy-user",
        port: "abc",
      },
    });

    expect(config.user).toBe("legacy-user");
    expect(config.port).toBe(DEFAULT_SQL_SERVER_CONFIG.port);
  });

  it("normalizes connection test response from success/message shape", () => {
    const result = normalizeSqlConnectionTestPayload({
      success: true,
      message: "Connection successful",
    });

    expect(result).toEqual({
      connected: true,
      message: "Connection successful",
    });
  });

  it("normalizes wrapped connection test response from connected/message shape", () => {
    const result = normalizeSqlConnectionTestPayload({
      data: {
        connected: false,
        message: "Connection inactive",
      },
    });

    expect(result).toEqual({
      connected: false,
      message: "Connection inactive",
    });
  });

  it("maps frontend form state to backend request shape", () => {
    expect(
      toSqlServerConfigRequest({
        host: "10.0.0.2",
        port: 1444,
        database: "ERP2",
        user: "",
        password: "",
      }),
    ).toEqual({
      host: "10.0.0.2",
      port: 1444,
      database: "ERP2",
    });

    expect(
      toSqlServerConfigRequest({
        host: "10.0.0.2",
        port: 1444,
        database: "ERP2",
        user: "svc-user",
        password: "secret",
      }),
    ).toEqual({
      host: "10.0.0.2",
      port: 1444,
      database: "ERP2",
      user: "svc-user",
      password: "secret",
    });
  });
});
