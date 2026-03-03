import api from "../httpClient";

// Register user
export const registerUser = async (userData: {
  username: string;
  password: string;
  full_name: string;
  employee_id?: string;
  phone?: string;
}) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

// Verify Supervisor PIN
export const verifyPin = async (data: {
  supervisor_username: string;
  pin: string;
  action: string;
  reason: string;
  staff_username: string;
  entity_id?: string;
}) => {
  try {
    const response = await api.post("/api/supervisor/verify-pin", data);
    return response.data;
  } catch (error: any) {
    __DEV__ && console.error("Verify PIN error:", error);
    throw error;
  }
};
