import Constants from "expo-constants";
import { Platform } from "react-native";

const HEALTH_PATH = "/api/health";

const parsePort = (value?: string | null): number | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const port = Number(trimmed);
  if (port < 1 || port > 65535) return null;
  return port;
};

const getCandidatePorts = (): number[] => {
  const envPort = parsePort(process.env.EXPO_PUBLIC_BACKEND_PORT);
  if (envPort) {
    const fallbackPorts = [8000, 8001, 8085];
    return Array.from(new Set([envPort, ...fallbackPorts]));
  }
  return [
    8000, 8001, 8085, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010,
  ];
};

const timeoutFetch = async (
  url: string,
  timeoutMs = 1500,
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    return res.status >= 200 && res.status < 500;
  } catch (error) {
    // Only log significant errors, not common probe failures
    if (error instanceof Error && error.name !== "AbortError") {
      // Use debug level logging for probes to avoid console clutter
      // console.log(`[BackendURL] Probe failed for ${url}:`, error.message);
    }
    return false;
  }
};

const stripTrailingSlash = (url: string) =>
  url.endsWith("/") ? url.slice(0, -1) : url;

const buildCandidates = (): string[] => {
  const candidates: string[] = [];
  const ports = getCandidatePorts();

  const addCandidate = (host: string) => {
    ports.forEach((port) => {
      candidates.push(`http://${host}:${port}`);
      // Only try https if it's a standard port or we are on a secure origin
      if (port === 443 || port === 8443) {
        candidates.push(`https://${host}:${port}`);
      }
    });
  };

  // 1) Platform-specific fallbacks (High Priority for Emulators)
  if (Platform.OS === "android") {
    addCandidate("10.0.2.2");
  }

  // 2) Explicit env override
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    candidates.push(process.env.EXPO_PUBLIC_BACKEND_URL);
  }

  // 3) Try to load from backend_port.json if on web (handled in resolveBackendUrl)
  // Removed "/backend_port.json" literal from candidates as it is not a valid base URL

  // 4) Runtime config from app.config.js extra
  const configUrl = Constants.expoConfig?.extra?.backendUrl as
    | string
    | undefined;
  if (configUrl) {
    candidates.push(configUrl);
  }

  // 4) Expo host URI (dev server IP) - best for LAN access
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) {
      addCandidate(host);
    }
  }

  // 5) mDNS Hostname (stock-verify.local)
  addCandidate("stock-verify.local");

  // 6) Web fallback to current hostname
  if (Platform.OS === "web" && typeof window !== "undefined") {
    addCandidate(window.location.hostname || "localhost");
  }

  // 7) Localhost as final fallback for web only
  if (Platform.OS === "web") {
    addCandidate("localhost");
  }

  // De-dupe while preserving priority order
  return Array.from(
    new Set(candidates.filter(Boolean).map(stripTrailingSlash)),
  );
};

// Best-effort initial URL (sync) used until async probing finishes.
export const BACKEND_URL = "http://localhost:8001";

let resolvedBackendUrl: string | null = null;

export const resolveBackendUrl = async (): Promise<string> => {
  if (resolvedBackendUrl) return resolvedBackendUrl;

  const candidates = buildCandidates();

  // Web-specific: Try to load from backend_port.json first
  if (Platform.OS === "web") {
    try {
      const response = await fetch("/backend_port.json");
      if (response.ok) {
        const portData = await response.json();
        if (portData.url) {
          console.log(
            "[BackendURL] Found URL in backend_port.json:",
            portData.url,
          );
          // Insert at the beginning of candidates
          candidates.unshift(stripTrailingSlash(portData.url));
        }
      }
    } catch (e) {
      console.debug("[BackendURL] Failed to fetch /backend_port.json:", e);
    }
  }

  console.log("[BackendURL] Probing candidates in parallel:", candidates);

  try {
    // Create a promise for each candidate that resolves with the URL if healthy,
    // or resolves with null if it fails/times out.
    const probePromises = candidates.map(async (url) => {
      const isHealthy = await timeoutFetch(`${url}${HEALTH_PATH}`, 3000);
      if (isHealthy) {
        console.log(`[BackendURL] Candidate passed: ${url}`);
        return url;
      }
      return null;
    });

    // Wait for all probes but process them as they finish if possible
    // For simplicity and reliably picking the best one, we wait for all or a timeout
    const results = await Promise.all(probePromises);

    // Pick the first successful one (preserving candidate priority)
    const bestUrl = results.find((url) => url !== null);

    if (bestUrl) {
      console.log(`[BackendURL] Resolved healthy backend at: ${bestUrl}`);
      resolvedBackendUrl = bestUrl;
      return bestUrl;
    }
  } catch (err) {
    console.error("[BackendURL] Discovery process failed:", err);
  }

  // Fallback if nothing responds
  console.warn(
    "[BackendURL] No healthy backend found! Fallback to:",
    BACKEND_URL,
  );
  resolvedBackendUrl = BACKEND_URL;
  return BACKEND_URL;
};

export const initializeBackendURL = async (): Promise<string> => {
  const url = await resolveBackendUrl();
  console.log("[BackendURL] Initialized with:", url);
  return url;
};

export const getBackendURL = () => resolvedBackendUrl ?? BACKEND_URL;
