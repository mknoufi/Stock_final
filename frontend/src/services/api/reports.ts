import api from "../httpClient";
import { Platform } from "react-native";

export const getAvailableReports = async () => {
  try {
    const response = await api.get("/api/admin/control/reports/available");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get available reports error:", error);
    throw error;
  }
};

export type AdminControlReportFormat = "json" | "csv" | "excel";

export type GenerateAdminControlReportResult =
  | { kind: "json"; data: any }
  | { kind: "file"; blob: Blob; fileName: string; contentType?: string }
  | {
      kind: "file";
      arrayBuffer: ArrayBuffer;
      fileName: string;
      contentType?: string;
    };

export const generateReport = async (
  reportId: string,
  options: {
    format?: AdminControlReportFormat;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<GenerateAdminControlReportResult> => {
  try {
    const format = options.format ?? "json";
    const params = {
      report_id: reportId,
      format,
      start_date: options.startDate,
      end_date: options.endDate,
    };

    const responseType =
      format === "json" ? "json" : Platform.OS === "web" ? "blob" : "arraybuffer";

    const response = await api.post("/api/admin/control/reports/generate", null, {
      params,
      responseType: responseType as any,
    });

    const header =
      (response.headers?.["content-disposition"] as string | undefined) ||
      (response.headers?.["Content-Disposition"] as string | undefined);

    const fileName =
      header?.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i)?.[1]?.trim() ||
      `${reportId}_${new Date().toISOString().slice(0, 10)}.${format === "excel" ? "xlsx" : format}`;

    if (format === "json") {
      return { kind: "json", data: response.data };
    }

    const contentType = response.headers?.["content-type"] as string | undefined;
    if (Platform.OS === "web") {
      return {
        kind: "file",
        blob: response.data as Blob,
        fileName,
        contentType,
      };
    }

    return {
      kind: "file",
      arrayBuffer: response.data as ArrayBuffer,
      fileName,
      contentType,
    };
  } catch (error: unknown) {
    __DEV__ && console.error("Generate report error:", error);
    throw error;
  }
};

// ==========================================
// EXPORT SCHEDULES API
// ==========================================

export const getExportSchedules = async (enabled?: boolean) => {
  try {
    const params = new URLSearchParams();
    if (enabled !== undefined) params.append("enabled", enabled.toString());

    const response = await api.get(`/api/exports/schedules?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export schedules error:", error);
    throw error;
  }
};

export const getExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.get(`/api/exports/schedules/${scheduleId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export schedule error:", error);
    throw error;
  }
};

export const createExportSchedule = async (scheduleData: Record<string, unknown>) => {
  try {
    const response = await api.post("/api/exports/schedules", scheduleData);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Create export schedule error:", error);
    throw error;
  }
};

export const updateExportSchedule = async (
  scheduleId: string,
  scheduleData: Record<string, unknown>
) => {
  try {
    const response = await api.put(`/api/exports/schedules/${scheduleId}`, scheduleData);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Update export schedule error:", error);
    throw error;
  }
};

export const deleteExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.delete(`/api/exports/schedules/${scheduleId}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Delete export schedule error:", error);
    throw error;
  }
};

export const triggerExportSchedule = async (scheduleId: string) => {
  try {
    const response = await api.post(`/api/exports/schedules/${scheduleId}/execute`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Trigger export schedule error:", error);
    throw error;
  }
};

export const getExportResults = async (
  scheduleId?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 50
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (scheduleId) params.append("schedule_id", scheduleId);
    if (status) params.append("status", status);

    const response = await api.get(`/api/exports/results?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get export results error:", error);
    throw error;
  }
};

export const downloadExportResult = async (resultId: string) => {
  try {
    const response = await api.get(`/api/exports/results/${resultId}/download`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Download export result error:", error);
    throw error;
  }
};
