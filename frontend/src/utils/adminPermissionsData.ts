type UnknownRecord = Record<string, unknown>;

export type PermissionCatalog = {
  permissions: string[];
  categories: Record<string, string[]>;
};

const isRecord = (value: unknown): value is UnknownRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
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

export const normalizePermissionCatalogPayload = (value: unknown): PermissionCatalog => {
  const source = unwrapPayload(value);
  const categoriesSource = isRecord(source.categories) ? source.categories : {};
  const categories: Record<string, string[]> = {};

  for (const [key, categoryPermissions] of Object.entries(categoriesSource)) {
    const normalizedPermissions = normalizeStringArray(categoryPermissions);
    if (normalizedPermissions.length > 0) {
      categories[key] = normalizedPermissions;
    }
  }

  return {
    permissions: normalizeStringArray(source.permissions),
    categories,
  };
};

export const normalizeUserPermissionsPayload = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return normalizeStringArray(value);
  }

  const source = unwrapPayload(value);
  return normalizeStringArray(source.permissions);
};

export const applyUserPermissionChange = (
  currentPermissions: string[],
  permission: string,
  action: "add" | "remove",
): string[] => {
  const normalizedPermission = permission.trim();
  if (!normalizedPermission) {
    return currentPermissions;
  }

  if (action === "add") {
    if (currentPermissions.includes(normalizedPermission)) {
      return currentPermissions;
    }
    return [...currentPermissions, normalizedPermission];
  }

  return currentPermissions.filter((entry) => entry !== normalizedPermission);
};
