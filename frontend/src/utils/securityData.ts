type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asArray = (value: unknown): Record<string, unknown>[] => {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
};

const readData = (value: unknown): UnknownRecord => {
  if (!isRecord(value)) return {};
  if (isRecord(value.data)) return value.data;
  return value;
};

export const normalizeFailedLogins = (value: unknown): Record<string, unknown>[] => {
  const data = readData(value);
  return asArray(data.failed_logins);
};

export const normalizeSuspiciousActivity = (
  value: unknown,
): { suspicious_ips: Record<string, unknown>[]; suspicious_users: Record<string, unknown>[] } => {
  const data = readData(value);
  return {
    suspicious_ips: asArray(data.suspicious_ips),
    suspicious_users: asArray(data.suspicious_users),
  };
};

export const normalizeSecuritySessions = (
  value: unknown,
): Record<string, unknown>[] => {
  const data = readData(value);
  return asArray(data.sessions);
};

export const normalizeSecuritySummary = (
  value: unknown,
): { summary: Record<string, unknown>; recent_events: Record<string, unknown>[] } => {
  const data = readData(value);
  const summary = isRecord(data.summary) ? data.summary : {};
  return {
    summary,
    recent_events: asArray(data.recent_events),
  };
};

export const normalizeAuditLogs = (value: unknown): Record<string, unknown>[] => {
  const data = readData(value);
  return asArray(data.audit_logs);
};

export const normalizeIpTracking = (value: unknown): Record<string, unknown>[] => {
  const data = readData(value);
  return asArray(data.ip_tracking);
};
