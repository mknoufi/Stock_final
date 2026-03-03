import api from "../httpClient";

// Activity Log API
export const getActivityLogs = async (
  page: number = 1,
  pageSize: number = 50,
  user?: string,
  action?: string,
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (user) params.append("user", user);
    if (action) params.append("action", action);
    if (status) params.append("status_filter", status);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("🔍 [Activity Logs] Fetching activity logs:", {
        page,
        pageSize,
        filters: { user, action, status, startDate, endDate },
        url: `/api/activity-logs?${params.toString()}`,
      });

    const response = await api.get(`/api/activity-logs?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Activity Logs] Success:", {
        activitiesReturned: response.data?.activities?.length || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Activity Logs] Error fetching activity logs:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { page, pageSize, user, action, status, startDate, endDate },
      });
    throw error;
  }
};

export const getActivityStats = async (startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("📊 [Activity Stats] Fetching statistics:", {
        filters: { startDate, endDate },
        url: `/api/activity-logs/stats?${params.toString()}`,
      });

    const response = await api.get(`/api/activity-logs/stats?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Activity Stats] Success:", {
        total: response.data?.total || 0,
        successCount: response.data?.by_status?.success || 0,
        errorCount: response.data?.by_status?.error || 0,
        warningCount: response.data?.by_status?.warning || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Activity Stats] Error fetching statistics:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { startDate, endDate },
      });
    throw error;
  }
};

// Error Log API
export const getErrorLogs = async (
  page: number = 1,
  pageSize: number = 50,
  severity?: string,
  errorType?: string,
  endpoint?: string,
  resolved?: boolean,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (severity) params.append("severity", severity);
    if (errorType) params.append("error_type", errorType);
    if (endpoint) params.append("endpoint", endpoint);
    if (resolved !== undefined) params.append("resolved", resolved.toString());
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("🔍 [Error Logs] Fetching error logs:", {
        page,
        pageSize,
        filters: {
          severity,
          errorType,
          endpoint,
          resolved,
          startDate,
          endDate,
        },
        url: `/api/error-logs?${params.toString()}`,
      });

    const response = await api.get(`/api/error-logs?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Error Logs] Success:", {
        totalErrors: response.data?.pagination?.total || 0,
        page: response.data?.pagination?.page || page,
        errorsReturned: response.data?.errors?.length || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Logs] Error fetching error logs:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: {
          page,
          pageSize,
          severity,
          errorType,
          endpoint,
          resolved,
          startDate,
          endDate,
        },
      });
    throw error;
  }
};

export const getErrorStats = async (startDate?: string, endDate?: string) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    __DEV__ &&
      console.log("📊 [Error Stats] Fetching statistics:", {
        filters: { startDate, endDate },
        url: `/api/error-logs/stats?${params.toString()}`,
      });

    const response = await api.get(`/api/error-logs/stats?${params.toString()}`);

    __DEV__ &&
      console.log("✅ [Error Stats] Success:", {
        total: response.data?.total || 0,
        criticalCount: response.data?.by_severity?.critical || 0,
        errorCount: response.data?.by_severity?.error || 0,
        warningCount: response.data?.by_severity?.warning || 0,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Stats] Error fetching statistics:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        filters: { startDate, endDate },
      });
    throw error;
  }
};

export const getErrorDetail = async (errorId: string) => {
  try {
    __DEV__ && console.log("🔍 [Error Detail] Fetching error details:", { errorId });

    const response = await api.get(`/api/error-logs/${errorId}`);

    __DEV__ &&
      console.log("✅ [Error Detail] Success:", {
        errorId,
        severity: response.data?.severity,
        errorType: response.data?.error_type,
        timestamp: response.data?.timestamp,
      });

    return response.data;
  } catch (error: any) {
    __DEV__ &&
      console.error("❌ [Error Detail] Error fetching error details:", {
        errorId,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
    throw error;
  }
};

export const resolveError = async (errorId: string, resolutionNote?: string) => {
  try {
    const response = await api.put(`/api/error-logs/${errorId}/resolve`, {
      resolution_note: resolutionNote,
    });
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Resolve error error:", error);
    throw error;
  }
};

export const clearErrorLogs = async () => {
  try {
    const response = await api.delete("/api/error-logs");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Clear error logs error:", error);
    throw error;
  }
};
