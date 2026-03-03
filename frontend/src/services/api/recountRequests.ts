import api from "../httpClient";

const BASE = "/api/recount-requests";

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

export const createRecountRequest = async (payload: Record<string, unknown>) => {
  const { data } = await api.post(BASE, payload);
  return data;
};

export const listRecountRequests = async (params?: {
  status?: string;
  assigned_to?: string;
  session_id?: string;
  skip?: number;
  limit?: number;
}) => {
  const { data } = await api.get(BASE, { params });
  return data;
};

export const getRecountRequest = async (requestId: string) => {
  const { data } = await api.get(`${BASE}/${requestId}`);
  return data;
};

export const getRecountRejectionHistory = async (requestId: string) => {
  const { data } = await api.get(`${BASE}/${requestId}/rejection-history`);
  return data;
};

// ------------------------------------------------------------------
// State transitions
// ------------------------------------------------------------------

export const acceptRecountRequest = async (
  requestId: string,
  payload: Record<string, unknown> = {}
) => {
  const { data } = await api.post(`${BASE}/${requestId}/accept`, payload);
  return data;
};

export const rejectRecountRequest = async (
  requestId: string,
  payload: Record<string, unknown> = {}
) => {
  const { data } = await api.post(`${BASE}/${requestId}/reject`, payload);
  return data;
};

export const startRecount = async (requestId: string, payload: Record<string, unknown> = {}) => {
  const { data } = await api.post(`${BASE}/${requestId}/start`, payload);
  return data;
};

export const submitRecount = async (requestId: string, payload: Record<string, unknown>) => {
  const { data } = await api.post(`${BASE}/${requestId}/submit`, payload);
  return data;
};

export const completeRecountRequest = async (
  requestId: string,
  payload: Record<string, unknown> = {}
) => {
  const { data } = await api.post(`${BASE}/${requestId}/complete`, payload);
  return data;
};

export const cancelRecountRequest = async (
  requestId: string,
  payload: Record<string, unknown> = {}
) => {
  const { data } = await api.post(`${BASE}/${requestId}/cancel`, payload);
  return data;
};

export const reassignRecountRequest = async (
  requestId: string,
  payload: Record<string, unknown>
) => {
  const { data } = await api.post(`${BASE}/${requestId}/reassign`, payload);
  return data;
};
