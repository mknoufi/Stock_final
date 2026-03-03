export interface LogEntry {
  level?: string;
  message?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export const normalizeLogEntries = (value: unknown): LogEntry[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => {
      return Boolean(entry) && typeof entry === "object" && !Array.isArray(entry);
    })
    .map((entry) => ({
      ...entry,
      level: typeof entry.level === "string" ? entry.level : undefined,
      message: typeof entry.message === "string" ? entry.message : undefined,
      timestamp: typeof entry.timestamp === "string" ? entry.timestamp : undefined,
    }));
};

