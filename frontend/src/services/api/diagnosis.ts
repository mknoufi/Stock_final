import api from "../httpClient";

/**
 * Get comprehensive health status with auto-diagnosis
 */
export const getDiagnosisHealth = async () => {
  try {
    const response = await api.get("/api/diagnosis/health");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get diagnosis health error:", error);
    throw error;
  }
};

/**
 * Get error statistics with analysis
 * @param hours Time window in hours
 */
export const getDiagnosisStats = async (hours: number = 24) => {
  try {
    const response = await api.get(`/api/diagnosis/statistics?hours=${hours}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get diagnosis stats error:", error);
    throw error;
  }
};

/**
 * Manually diagnose an error
 * @param errorInfo Error details (type, message, context)
 */
export const diagnoseError = async (errorInfo: {
  error_type: string;
  error_message: string;
  context?: Record<string, any>;
}) => {
  try {
    const response = await api.post("/api/diagnosis/diagnose", errorInfo);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Diagnose error failed:", error);
    throw error;
  }
};
