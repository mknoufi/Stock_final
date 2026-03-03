import api from "../httpClient";

export const getSqlServerConfig = async () => {
  try {
    const response = await api.get("/api/admin/control/sql-server/config");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL Server config error:", error);
    throw error;
  }
};

export const updateSqlServerConfig = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/control/sql-server/config", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update SQL Server config error:", error);
    throw error;
  }
};

export const testSqlServerConnection = async (config?: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/control/sql-server/test", config || {});
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test SQL Server connection error:", error);
    throw error;
  }
};

// SQL Server Connection API (Additional endpoints found in api.ts)
export const getSQLStatus = async () => {
  try {
    const response = await api.get("/api/admin/sql/status");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL status error:", error);
    throw error;
  }
};

export const testSQLConnection = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/sql/test", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Test SQL connection error:", error);
    throw error;
  }
};

export const configureSQLConnection = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/admin/sql/configure", config);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Configure SQL connection error:", error);
    throw error;
  }
};

export const getSQLConnectionHistory = async () => {
  try {
    const response = await api.get("/api/admin/sql/history");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get SQL connection history error:", error);
    throw error;
  }
};
