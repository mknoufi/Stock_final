export type AdminReport = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getReportsArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];
  if (Array.isArray(value.reports)) return value.reports;
  if (isRecord(value.data) && Array.isArray(value.data.reports)) {
    return value.data.reports;
  }
  return [];
};

export const normalizeReports = (value: unknown): AdminReport[] => {
  const reports = getReportsArray(value);
  const normalized: AdminReport[] = [];

  for (const item of reports) {
    if (!isRecord(item)) continue;
    const id = asText(item.id);
    if (!id) continue;

    normalized.push({
      id,
      name: asText(item.name) || id,
      description: asText(item.description) || "",
      category: (asText(item.category) || "general").toLowerCase(),
    });
  }

  return normalized;
};
