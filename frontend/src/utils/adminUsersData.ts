import { NormalizedUser, User, normalizeUser } from "../types/user";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const asArray = (value: unknown): unknown[] => {
  return Array.isArray(value) ? value : [];
};

const asNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asRole = (value: unknown): User["role"] => {
  if (value === "admin" || value === "supervisor" || value === "staff") return value;
  return "staff";
};

const asStringOrNull = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

const normalizeUserRecord = (value: unknown): NormalizedUser | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === "string" ? value.id.trim() : "";
  const username = typeof value.username === "string" ? value.username.trim() : "";
  if (!id || !username) return null;

  const permissions = asArray(value.permissions).filter(
    (item): item is string => typeof item === "string",
  );
  const normalized = normalizeUser({
    id,
    username,
    full_name: typeof value.full_name === "string" ? value.full_name : "",
    role: asRole(value.role),
    email: asStringOrNull(value.email),
    is_active: typeof value.is_active === "boolean" ? value.is_active : false,
    permissions,
    has_pin: typeof value.has_pin === "boolean" ? value.has_pin : undefined,
    created_at: asStringOrNull(value.created_at),
    last_login: asStringOrNull(value.last_login),
  });

  const permissionsCount = Number(value.permissions_count);
  if (Number.isFinite(permissionsCount)) {
    normalized.permissionsCount = permissionsCount;
  }
  return normalized;
};

const getPayload = (value: unknown): UnknownRecord => {
  if (!isRecord(value)) return {};
  if (isRecord(value.data)) return value.data;
  return value;
};

export const normalizeUserListPayload = (
  value: unknown,
): {
  users: NormalizedUser[];
  total: number;
  totalPages: number;
} => {
  const payload = getPayload(value);
  const users = asArray(payload.users)
    .map(normalizeUserRecord)
    .filter((item): item is NormalizedUser => !!item);

  const total = asNumber(payload.total, users.length);
  const totalPages = Math.max(1, asNumber(payload.total_pages, 1));

  return {
    users,
    total,
    totalPages,
  };
};

export const reconcileSelectedUserIds = (
  selectedUserIds: Iterable<string>,
  visibleUsers: NormalizedUser[],
): Set<string> => {
  const visibleIds = new Set(visibleUsers.map((user) => user.id));
  return new Set(
    Array.from(selectedUserIds).filter((id) => visibleIds.has(id)),
  );
};
