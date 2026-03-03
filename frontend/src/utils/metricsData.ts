type EndpointStat = { path: string; count: number };
type ErrorStat = { type: string; count: number };

export interface NormalizedMetricsStats {
  total_requests: number;
  success_rate: number;
  avg_response_time: number;
  error_count: number;
  active_users: number;
  total_sessions: number;
  active_sessions: number;
  total_count_lines: number;
  pending_approvals: number;
  total_items: number;
  unknown_items: number;
  top_endpoints: EndpointStat[];
  recent_errors: ErrorStat[];
}

export interface NormalizedMetricsHealth {
  status: "healthy" | "degraded" | "critical";
  mongodb: { status: "connected" | "disconnected" | "unknown" };
  dependencies?: { sql_server?: { status: string } };
  uptime?: number;
}

const toNumber = (value: unknown, fallback: number = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const normalizeSuccessRate = (value: unknown): number => {
  const raw = toNumber(value, 0);
  if (raw > 1 && raw <= 100) return raw / 100;
  return Math.max(0, Math.min(1, raw));
};

const normalizeEndpointStats = (value: unknown): EndpointStat[] => {
  return toArray<any>(value)
    .map((entry) => ({
      path: typeof entry?.path === "string" ? entry.path : String(entry?.path || ""),
      count: toNumber(entry?.count, 0),
    }))
    .filter((entry) => entry.path.length > 0);
};

const normalizeErrorStats = (value: unknown): ErrorStat[] => {
  return toArray<any>(value)
    .map((entry) => ({
      type: typeof entry?.type === "string" ? entry.type : String(entry?.type || "unknown"),
      count: toNumber(entry?.count, 0),
    }))
    .filter((entry) => entry.count >= 0);
};

const emptyStats = (): NormalizedMetricsStats => ({
  total_requests: 0,
  success_rate: 0,
  avg_response_time: 0,
  error_count: 0,
  active_users: 0,
  total_sessions: 0,
  active_sessions: 0,
  total_count_lines: 0,
  pending_approvals: 0,
  total_items: 0,
  unknown_items: 0,
  top_endpoints: [],
  recent_errors: [],
});

export const normalizeMetricsStats = (payload: unknown): NormalizedMetricsStats => {
  if (!payload || typeof payload !== "object") return emptyStats();

  const root = payload as Record<string, any>;
  const source =
    root.services && typeof root.services === "object" ? root.services : root;

  return {
    total_requests: toNumber(source.total_requests, 0),
    success_rate: normalizeSuccessRate(source.success_rate),
    avg_response_time: toNumber(source.avg_response_time, 0),
    error_count: toNumber(source.error_count, 0),
    active_users: toNumber(source.active_users, 0),
    total_sessions: toNumber(source.total_sessions, 0),
    active_sessions: toNumber(source.active_sessions, 0),
    total_count_lines: toNumber(source.total_count_lines, 0),
    pending_approvals: toNumber(source.pending_approvals, 0),
    total_items: toNumber(source.total_items, 0),
    unknown_items: toNumber(source.unknown_items, 0),
    top_endpoints: normalizeEndpointStats(source.top_endpoints),
    recent_errors: normalizeErrorStats(source.recent_errors),
  };
};

const deriveMongoStatus = (payload: Record<string, any>): "connected" | "disconnected" | "unknown" => {
  const explicit = payload.mongodb?.status;
  if (explicit === "connected" || explicit === "disconnected") return explicit;
  const legacy = payload.mongo;
  if (legacy === "OK") return "connected";
  if (legacy === "OFFLINE") return "disconnected";
  return "unknown";
};

const deriveSqlStatus = (payload: Record<string, any>): string => {
  const explicit = payload.dependencies?.sql_server?.status;
  if (typeof explicit === "string") return explicit;
  const featureStatus = payload.features?.sql?.status;
  if (typeof featureStatus === "string") return featureStatus.toLowerCase();
  const legacy = payload.sql;
  if (legacy === "CONNECTED") return "healthy";
  if (legacy === "OFFLINE") return "offline";
  return "unknown";
};

export const normalizeMetricsHealth = (payload: unknown): NormalizedMetricsHealth => {
  if (!payload || typeof payload !== "object") {
    return {
      status: "critical",
      mongodb: { status: "unknown" },
      dependencies: { sql_server: { status: "unknown" } },
    };
  }

  const root = payload as Record<string, any>;
  const mongodbStatus = deriveMongoStatus(root);
  const sqlStatus = deriveSqlStatus(root);

  let status: "healthy" | "degraded" | "critical" = "degraded";
  if (typeof root.status === "string") {
    status = root.status as "healthy" | "degraded" | "critical";
  } else if (mongodbStatus === "disconnected") {
    status = "critical";
  } else if (sqlStatus === "healthy" || sqlStatus === "connected") {
    status = "healthy";
  } else {
    status = "degraded";
  }

  const uptime = toNumber(root.uptime ?? root.system_resources?.uptime_seconds, 0);

  return {
    status,
    mongodb: { status: mongodbStatus },
    dependencies: { sql_server: { status: sqlStatus } },
    uptime: uptime > 0 ? uptime : undefined,
  };
};

