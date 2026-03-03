import api from "../httpClient";

// Get Zones
export const getZones = async () => {
  try {
    const response = await api.get("/api/locations/zones");
    return response.data;
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      console.error("Error fetching zones:", error);
    }
    throw error;
  }
};

// Get Warehouses
export const getWarehouses = async (zone?: string) => {
  try {
    const url = zone
      ? `/api/locations/warehouses?zone=${encodeURIComponent(zone)}`
      : "/api/locations/warehouses";
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      console.error("Error fetching warehouses:", error);
    }
    throw error;
  }
};
