export interface AdminSettings {
  api_timeout: number;
  api_rate_limit: number;
  cache_enabled: boolean;
  cache_ttl: number;
  cache_max_size: number;
  sync_interval: number;
  sync_batch_size: number;
  auto_sync_enabled: boolean;
  session_timeout: number;
  max_concurrent_sessions: number;
  log_level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  log_retention_days: number;
  enable_audit_log: boolean;
  mongo_pool_size: number;
  sql_pool_size: number;
  query_timeout: number;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  jwt_expiration: number;
  enable_compression: boolean;
  max_request_size: number;
  enable_cors: boolean;
  [key: string]: string | number | boolean;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const readPayload = (value: unknown): UnknownRecord => {
  if (!isRecord(value)) return {};
  if (isRecord(value.data)) return value.data;
  return value;
};

const asPositiveNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const asBoolean = (value: unknown, fallback: boolean): boolean => {
  return typeof value === "boolean" ? value : fallback;
};

const asLogLevel = (
  value: unknown,
  fallback: AdminSettings["log_level"],
): AdminSettings["log_level"] => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toUpperCase();
  if (
    normalized === "DEBUG" ||
    normalized === "INFO" ||
    normalized === "WARN" ||
    normalized === "ERROR"
  ) {
    return normalized;
  }
  return fallback;
};

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  api_timeout: 30,
  api_rate_limit: 100,
  cache_enabled: true,
  cache_ttl: 3600,
  cache_max_size: 1000,
  sync_interval: 3600,
  sync_batch_size: 100,
  auto_sync_enabled: true,
  session_timeout: 3600,
  max_concurrent_sessions: 50,
  log_level: "INFO",
  log_retention_days: 30,
  enable_audit_log: true,
  mongo_pool_size: 10,
  sql_pool_size: 5,
  query_timeout: 30,
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_lowercase: true,
  password_require_numbers: true,
  jwt_expiration: 86400,
  enable_compression: true,
  max_request_size: 10485760,
  enable_cors: true,
};

export const normalizeAdminSettingsPayload = (value: unknown): AdminSettings => {
  const payload = readPayload(value);
  return {
    api_timeout: asPositiveNumber(payload.api_timeout, DEFAULT_ADMIN_SETTINGS.api_timeout),
    api_rate_limit: asPositiveNumber(payload.api_rate_limit, DEFAULT_ADMIN_SETTINGS.api_rate_limit),
    cache_enabled: asBoolean(payload.cache_enabled, DEFAULT_ADMIN_SETTINGS.cache_enabled),
    cache_ttl: asPositiveNumber(payload.cache_ttl, DEFAULT_ADMIN_SETTINGS.cache_ttl),
    cache_max_size: asPositiveNumber(payload.cache_max_size, DEFAULT_ADMIN_SETTINGS.cache_max_size),
    sync_interval: asPositiveNumber(payload.sync_interval, DEFAULT_ADMIN_SETTINGS.sync_interval),
    sync_batch_size: asPositiveNumber(payload.sync_batch_size, DEFAULT_ADMIN_SETTINGS.sync_batch_size),
    auto_sync_enabled: asBoolean(
      payload.auto_sync_enabled,
      DEFAULT_ADMIN_SETTINGS.auto_sync_enabled,
    ),
    session_timeout: asPositiveNumber(
      payload.session_timeout,
      DEFAULT_ADMIN_SETTINGS.session_timeout,
    ),
    max_concurrent_sessions: asPositiveNumber(
      payload.max_concurrent_sessions,
      DEFAULT_ADMIN_SETTINGS.max_concurrent_sessions,
    ),
    log_level: asLogLevel(payload.log_level, DEFAULT_ADMIN_SETTINGS.log_level),
    log_retention_days: asPositiveNumber(
      payload.log_retention_days,
      DEFAULT_ADMIN_SETTINGS.log_retention_days,
    ),
    enable_audit_log: asBoolean(payload.enable_audit_log, DEFAULT_ADMIN_SETTINGS.enable_audit_log),
    mongo_pool_size: asPositiveNumber(
      payload.mongo_pool_size,
      DEFAULT_ADMIN_SETTINGS.mongo_pool_size,
    ),
    sql_pool_size: asPositiveNumber(payload.sql_pool_size, DEFAULT_ADMIN_SETTINGS.sql_pool_size),
    query_timeout: asPositiveNumber(payload.query_timeout, DEFAULT_ADMIN_SETTINGS.query_timeout),
    password_min_length: asPositiveNumber(
      payload.password_min_length,
      DEFAULT_ADMIN_SETTINGS.password_min_length,
    ),
    password_require_uppercase: asBoolean(
      payload.password_require_uppercase,
      DEFAULT_ADMIN_SETTINGS.password_require_uppercase,
    ),
    password_require_lowercase: asBoolean(
      payload.password_require_lowercase,
      DEFAULT_ADMIN_SETTINGS.password_require_lowercase,
    ),
    password_require_numbers: asBoolean(
      payload.password_require_numbers,
      DEFAULT_ADMIN_SETTINGS.password_require_numbers,
    ),
    jwt_expiration: asPositiveNumber(payload.jwt_expiration, DEFAULT_ADMIN_SETTINGS.jwt_expiration),
    enable_compression: asBoolean(
      payload.enable_compression,
      DEFAULT_ADMIN_SETTINGS.enable_compression,
    ),
    max_request_size: asPositiveNumber(
      payload.max_request_size,
      DEFAULT_ADMIN_SETTINGS.max_request_size,
    ),
    enable_cors: asBoolean(payload.enable_cors, DEFAULT_ADMIN_SETTINGS.enable_cors),
  };
};

