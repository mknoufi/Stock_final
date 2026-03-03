import ConnectionManager from "./connectionManager";

const MDNS_HOST = "stock-verify.local";

const parsePort = (value?: string | null): number | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const port = Number(trimmed);
  if (port < 1 || port > 65535) return null;
  return port;
};

const getMdnsPort = (): number => {
  return parsePort(process.env.EXPO_PUBLIC_BACKEND_PORT) ?? 8001;
};

const stripTrailingSlash = (url: string) => (url.endsWith("/") ? url.slice(0, -1) : url);

const getEnvBackendUrl = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return stripTrailingSlash(trimmed);
};

// Best-effort initial URL (sync) used until async probing finishes.
const DEFAULT_BACKEND_URL =
  getEnvBackendUrl() ?? `http://${MDNS_HOST}:${getMdnsPort()}`;

export const BACKEND_URL = stripTrailingSlash(DEFAULT_BACKEND_URL);

/**
 * DEPRECATED: Use ConnectionManager.getInstance().initialize() instead.
 * This remains for backward compatibility but delegates to ConnectionManager.
 */
export const resolveBackendUrl = async (): Promise<string> => {
  const cm = ConnectionManager.getInstance();
  await cm.initialize();
  const conn = cm.getConnection();
  return conn?.backendUrl || BACKEND_URL;
};

/**
 * DEPRECATED: Use ConnectionManager.getInstance().initialize() instead.
 */
export const initializeBackendURL = async (): Promise<string> => {
  return await resolveBackendUrl();
};

/**
 * Get the current backend URL.
 * Returns the latest healthy connection from ConnectionManager if available.
 */
export const getBackendURL = () => {
  const cm = ConnectionManager.getInstance();
  const conn = cm.getConnection();
  return conn?.backendUrl || BACKEND_URL;
};
