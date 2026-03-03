type UnknownRecord = Record<string, unknown>;

export type SqlServerConfigForm = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type SqlConnectionTestResult = {
  connected: boolean;
  message: string;
};

export const DEFAULT_SQL_SERVER_CONFIG: SqlServerConfigForm = {
  host: "",
  port: 1433,
  database: "",
  user: "",
  password: "",
};

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asString = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const unwrapPayload = (value: unknown): UnknownRecord => {
  if (!isRecord(value)) {
    return {};
  }

  if (isRecord(value.data)) {
    return value.data;
  }

  return value;
};

const normalizePort = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SQL_SERVER_CONFIG.port;
  }

  return Math.trunc(parsed);
};

export const normalizeSqlServerConfigPayload = (value: unknown): SqlServerConfigForm => {
  const source = unwrapPayload(value);
  const user = asString(source.user) || asString(source.username);

  return {
    host: asString(source.host),
    port: normalizePort(source.port),
    database: asString(source.database),
    user,
    password: "",
  };
};

export const normalizeSqlConnectionTestPayload = (value: unknown): SqlConnectionTestResult => {
  const source = unwrapPayload(value);
  const connected =
    typeof source.connected === "boolean"
      ? source.connected
      : typeof source.success === "boolean"
        ? source.success
        : false;

  const message = asString(source.message);
  return {
    connected,
    message: message || (connected ? "Connection successful" : "Connection failed"),
  };
};

export const toSqlServerConfigRequest = (config: SqlServerConfigForm): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    host: config.host.trim(),
    port: normalizePort(config.port),
    database: config.database.trim(),
  };

  const user = config.user.trim();
  if (user) {
    payload.user = user;
  }

  if (config.password) {
    payload.password = config.password;
  }

  return payload;
};
