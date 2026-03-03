import api from "../httpClient";

// ERP Configuration
export const getERPConfig = async () => {
  try {
    const response = await api.get("/api/erp/config");
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Get ERP config error:", error);
    throw error;
  }
};

// Refresh item stock from ERP (with longer timeout for slow ERP connections)
export const refreshItemStock = async (itemCode: string) => {
  try {
    const response = await api.post(
      `/api/erp/items/${encodeURIComponent(itemCode)}/refresh-stock`,
      {},
      { timeout: 30000 } // 30s timeout for slow ERP operations
    );
    return response.data;
  } catch (error: unknown) {
    __DEV__ && console.error("Refresh stock error:", error);
    throw error;
  }
};
