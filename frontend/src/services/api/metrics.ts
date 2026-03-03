import api from "../httpClient";

// ==========================================
// METRICS API
// ==========================================

export const getMetrics = async () => {
  try {
    const response = await api.get("/api/metrics");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics error:", error);
    throw error;
  }
};

export const getMetricsHealth = async () => {
  try {
    const response = await api.get("/api/metrics/health");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics health error:", error);
    throw error;
  }
};

// Health check alias for backward compatibility
export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Health check error:", error);
    throw error;
  }
};

export const getMetricsStats = async () => {
  try {
    const response = await api.get("/api/metrics/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get metrics stats error:", error);
    throw error;
  }
};

// System Stats (originally in Admin Control in api.ts, fitting here or admin)
export const getSystemHealthScore = async () => {
  try {
    const response = await api.get("/api/admin/control/system/health-score");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system health score error:", error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const response = await api.get("/api/admin/control/system/stats");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get system stats error:", error);
    throw error;
  }
};

// Advanced Analytics API
export const getVarianceTrend = async (days: number = 30) => {
  try {
    const response = await api.get(`/api/variance/trend?days=${days}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get variance trend error:", error);
    throw error;
  }
};

export const getStaffPerformance = async (days: number = 30) => {
  try {
    const response = await api.get(`/api/metrics/staff-performance?days=${days}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get staff performance error:", error);
    throw error;
  }
};
