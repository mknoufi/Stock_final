import api from "../httpClient";

// Database Mapping API
export const getAvailableTables = async (
  host: string,
  port: number,
  database: string,
  user?: string,
  password?: string,
  schema: string = "dbo"
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
      schema,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.get(`/api/mapping/tables?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get tables error:", error);
    throw error;
  }
};

export const getTableColumns = async (
  host: string,
  port: number,
  database: string,
  tableName: string,
  user?: string,
  password?: string,
  schema: string = "dbo"
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
      table_name: tableName,
      schema,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.get(`/api/mapping/columns?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get columns error:", error);
    throw error;
  }
};

export const getCurrentMapping = async () => {
  try {
    const response = await api.get("/api/mapping/current");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get current mapping error:", error);
    throw error;
  }
};

export const testMapping = async (
  config: Record<string, unknown>,
  host: string,
  port: number,
  database: string,
  user?: string,
  password?: string
) => {
  try {
    const params = new URLSearchParams({
      host,
      port: port.toString(),
      database,
    });
    if (user) params.append("user", user);
    if (password) params.append("password", password);

    const response = await api.post(`/api/mapping/preview?${params.toString()}`, config);

    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test mapping error:", error);
    throw error;
  }
};

export const saveMapping = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/mapping/save", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Save mapping error:", error);
    throw error;
  }
};

export const clearServiceLogs = async (service: string) => {
  try {
    const response = await api.post("/api/admin/control/logs/clear", null, {
      params: { service },
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error(`Clear ${service} logs error:`, error);
    throw error;
  }
};

// ==========================================
// ADMIN CONTROL PANEL APIs
// ==========================================

// Service Status Management
export const getServicesStatus = async () => {
  try {
    const response = await api.get("/api/admin/control/services/status");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get services status error:", error);
    throw error;
  }
};

export const startService = async (service: string) => {
  try {
    const response = await api.post(`/api/admin/control/services/${service}/start`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Start service error:", error);
    throw error;
  }
};

export const stopService = async (service: string) => {
  try {
    const response = await api.post(`/api/admin/control/services/${service}/stop`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Stop service error:", error);
    throw error;
  }
};

// System Health & Issues
export const getSystemIssues = async () => {
  try {
    const response = await api.get("/api/admin/control/system/issues");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system issues error:", error);
    throw error;
  }
};

// Device & Login Management
export const getLoginDevices = async () => {
  try {
    const response = await api.get("/api/admin/control/devices");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get login devices error:", error);
    throw error;
  }
};

// Log Management
export const getServiceLogs = async (service: string, lines: number = 100, level?: string) => {
  try {
    const params = new URLSearchParams({
      lines: lines.toString(),
    });
    if (level) params.append("level", level);

    const response = await api.get(`/api/admin/control/logs/${service}?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get service logs error:", error);
    throw error;
  }
};

export const getAvailablePermissions = async () => {
  try {
    const response = await api.get("/api/permissions/available");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get available permissions error:", error);
    throw error;
  }
};

export const getRolePermissions = async (role: string) => {
  try {
    const response = await api.get("/api/permissions/roles");
    const data = response.data?.data || {};
    return {
      success: true,
      data: {
        role,
        permissions: data[role] || [],
      },
    };
  } catch (error: unknown) {
    __DEV__ && console.error("Get role permissions error:", error);
    throw error;
  }
};

export const getUserPermissions = async (username: string) => {
  try {
    const response = await api.get(`/api/permissions/users/${username}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get user permissions error:", error);
    throw error;
  }
};

export const addUserPermissions = async (username: string, permissions: string[]) => {
  try {
    const response = await api.post(`/api/permissions/users/${username}/add`, { permissions });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Add user permissions error:", error);
    throw error;
  }
};

export const removeUserPermissions = async (username: string, permissions: string[]) => {
  try {
    const response = await api.post(`/api/permissions/users/${username}/remove`, { permissions });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Remove user permissions error:", error);
    throw error;
  }
};

// ==========================================
// UNKNOWN ITEMS MANAGEMENT
// ==========================================

export const getUnknownItems = async (
  sessionId?: string,
  reportedBy?: string,
  limit: number = 50,
  skip: number = 0
) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });
    if (sessionId) params.append("session_id", sessionId);
    if (reportedBy) params.append("reported_by", reportedBy);

    const response = await api.get(`/api/admin/unknown-items?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get unknown items error:", error);
    throw error;
  }
};

export const mapUnknownToSku = async (itemId: string, targetItemCode: string, notes?: string) => {
  try {
    const response = await api.post(`/api/admin/unknown-items/${itemId}/map`, {
      item_code: targetItemCode,
      resolve_notes: notes,
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Map unknown item error:", error);
    throw error;
  }
};

export const createSkuFromUnknown = async (
  itemId: string,
  skuData: {
    item_code: string;
    item_name: string;
    category: string;
    subcategory?: string;
    mrp: number;
    uom_code: string;
    resolve_notes?: string;
  }
) => {
  try {
    const response = await api.post(`/api/admin/unknown-items/${itemId}/create-sku`, skuData);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Create SKU from unknown error:", error);
    throw error;
  }
};

export const deleteUnknownItem = async (itemId: string) => {
  try {
    const response = await api.delete(`/api/admin/unknown-items/${itemId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Delete unknown item error:", error);
    throw error;
  }
};

// ==========================================
// WATCHTOWER / MONITORING
// ==========================================

export const getWatchtowerStats = async () => {
  try {
    const response = await api.get("/api/v2/sessions/watchtower");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get watchtower stats error:", error);
    throw error;
  }
};
