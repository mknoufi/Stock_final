export type AdminSession = {
  id: string;
  warehouse?: string;
  status?: string;
  total_items?: number;
  total_variance?: number;
  created_at?: string;
  started_at?: string;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const normalizeStatus = (value: unknown): string => {
  if (typeof value !== "string") return "UNKNOWN";
  return value.trim().toUpperCase() || "UNKNOWN";
};

const asNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const asText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  return value.trim() || undefined;
};

export const normalizeAdminSessions = (value: unknown): AdminSession[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is UnknownRecord => isRecord(item))
    .map((item) => {
      const id = String(item.id || item.session_id || item._id || "").trim();
      if (!id) return null;

      return {
        id,
        warehouse: asText(item.warehouse),
        status: normalizeStatus(item.status),
        total_items: asNumber(item.total_items),
        total_variance: asNumber(item.total_variance),
        created_at: asText(item.created_at),
        started_at: asText(item.started_at),
      } as AdminSession;
    })
    .filter((session): session is AdminSession => !!session);
};

export const buildAdminSessionStats = (sessions: AdminSession[]) => {
  let open = 0;
  let varianceSessions = 0;
  let totalItems = 0;

  for (const session of sessions) {
    const status = normalizeStatus(session.status);
    if (status === "OPEN" || status === "ACTIVE" || status === "RECONCILE") {
      open += 1;
    }
    if (Math.abs(asNumber(session.total_variance)) > 0) {
      varianceSessions += 1;
    }
    totalItems += asNumber(session.total_items);
  }

  return {
    totalSessions: sessions.length,
    open,
    varianceSessions,
    totalItems,
  };
};

