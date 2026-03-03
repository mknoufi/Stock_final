type UnknownRecord = Record<string, unknown>;

export type ServiceStatus = {
  running?: boolean;
  port?: number | null;
  pid?: number | null;
  url?: string | null;
  uptime?: number | null;
  status?: string | null;
};

export type NormalizedServices = {
  backend: ServiceStatus;
  frontend: ServiceStatus;
  mongodb: ServiceStatus;
  sql_server: ServiceStatus;
};

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const unwrapPayload = (value: unknown): UnknownRecord => {
  if (!isRecord(value)) return {};
  return isRecord(value.data) ? (value.data as UnknownRecord) : value;
};

const asRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is Record<string, unknown> =>
      !!entry && typeof entry === "object" && !Array.isArray(entry),
  );
};

const pickArray = (value: unknown, key: string): Record<string, unknown>[] => {
  if (!isRecord(value)) return [];
  return asRecordArray(value[key]);
};

const asServiceStatus = (value: unknown): ServiceStatus => {
  return isRecord(value) ? (value as ServiceStatus) : {};
};

export const normalizeIssues = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) return asRecordArray(value);
  const source = unwrapPayload(value);
  const direct = pickArray(source, "issues");
  if (direct.length > 0) return direct;
  return [];
};

export const normalizeDevices = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) return asRecordArray(value);
  const source = unwrapPayload(value);
  const direct = pickArray(source, "devices");
  if (direct.length > 0) return direct;
  return [];
};

export const normalizeServices = (value: unknown): NormalizedServices => {
  const source = unwrapPayload(value);
  return {
    backend: asServiceStatus(source.backend),
    frontend: asServiceStatus(source.frontend),
    mongodb: asServiceStatus(source.mongodb ?? source.database),
    sql_server: asServiceStatus(source.sql_server ?? source.sqlserver ?? source.sqlServer),
  };
};

export const getHealthScoreFromPayload = (value: unknown): number | undefined => {
  const source = unwrapPayload(value);
  if (typeof source.score !== "number" || !Number.isFinite(source.score)) {
    return undefined;
  }
  return clampHealthScore(source.score);
};

export const clampHealthScore = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};
