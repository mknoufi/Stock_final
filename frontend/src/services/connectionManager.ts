/**
 * Dynamic Connection Manager
 * Automatically detects and updates backend connection when ports/IPs change
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { createLogger } from "./logging";
import {
  buildHealthProbeHeaders,
  canProbeCandidateUrl,
  getProbeRuntimeContext,
} from "./connectionPolicy";

const log = createLogger("ConnectionManager");

// Connection state
interface ConnectionInfo {
  backendUrl: string;
  backendPort: number;
  backendIp: string;
  lastChecked: string;
  isHealthy: boolean;
  source?: "mdns" | "env" | "qr" | "unknown";
  connectionType?: "LAN" | "TUNNEL" | "MANUAL";
  isEnvLocked?: boolean;
  errorCode?: string;
  // Add connection quality metrics
  latencyMs?: number;
  lastError?: string;
  errorCount?: number;
}

const STORAGE_KEY = "connection_info";
const QR_STORAGE_KEY = "backend_qr_url";
const MDNS_HOST = "stock-verify.local";
const HEALTH_PATHS = ["/health/ready", "/health"];
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const CONNECTION_TIMEOUT = 3000; // Reduced to 3s for faster initial probing
const MAX_RETRIES = 1; // Reduced to 1 for initial discovery
const RETRY_DELAY = 1000; // Reduced to 1s

const normalizeUrl = (url: string) => (url.endsWith("/") ? url.slice(0, -1) : url);
const getEnvBackendUrl = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return normalizeUrl(trimmed);
};

class ConnectionManager {
  private static instance: ConnectionManager;
  private currentConnection: ConnectionInfo | null = null;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private listeners: ((connection: ConnectionInfo) => void)[] = [];
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private networkChangeTimer: NodeJS.Timeout | null = null;

  private constructor() {
    // ❌ NO side effects in constructor
    // Moved to initialize() method
  }

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Initialize connection with fallback detection
   * MOVED from constructor to prevent import-time execution
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Try to load saved connection first
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.currentConnection = JSON.parse(saved);
          log.info("Loaded saved connection", this.currentConnection);
        }

        // Listen for network changes
        NetInfo.addEventListener((state) => {
          this.handleNetworkChange(state);
        });

        // Always detect on startup to handle network changes
        await this.detectAndSetConnection();

        // Start health monitoring with retry logic
        this.startHealthMonitoring();

        // Mark as initialized to prevent re-initialization
        this.isInitialized = true;
      } catch (error) {
        log.error("Failed to initialize connection", error);
        this.setFallbackConnection(
          `Initialization failed: ${error instanceof Error ? error.message : String(error)}`
        );
        this.isInitialized = true;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  private handleNetworkChange(state: NetInfoState) {
    if (state.isConnected) {
      log.info("Network change detected", {
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
      // Debounce connection check
      if (this.networkChangeTimer) clearTimeout(this.networkChangeTimer);
      this.networkChangeTimer = setTimeout(() => {
        log.info("Triggering re-detection due to network change");
        this.detectAndSetConnection();
      }, 1500);
    }
  }

  /**
   * Detect best available backend connection
   */
  private async detectAndSetConnection(): Promise<ConnectionInfo> {
    log.info("Starting backend connection detection...");

    const candidates = await this.buildConnectionCandidates();
    const bestConnection = await this.findHealthyConnection(candidates);
    const envUrl = getEnvBackendUrl();
    const isEnvLocked = !!envUrl;

    if (bestConnection) {
      await this.setCurrentConnection(bestConnection);
      log.info("Selected healthy connection", bestConnection);
    } else if (envUrl) {
      const url = new URL(envUrl);
      const envConnection: ConnectionInfo = {
        backendUrl: envUrl,
        backendPort: parseInt(url.port) || 8001,
        backendIp: url.hostname,
        lastChecked: new Date().toISOString(),
        isHealthy: false,
        source: "env",
        isEnvLocked,
        errorCode: "ENV_BACKEND_UNREACHABLE",
        lastError: "Env backend unreachable",
        errorCount: 1,
      };
      await this.setCurrentConnection(envConnection);
      log.warn("Env backend unreachable; using env-locked connection", envConnection);
    } else {
      log.warn("No healthy connections found, using fallback");
      this.setFallbackConnection("NO_BACKEND_FOUND");
    }

    return this.currentConnection!;
  }

  /**
   * Build list of potential backend connections
   */
  private async buildConnectionCandidates(): Promise<{ url: string; priority: number }[]> {
    const candidates: { url: string; priority: number; source: ConnectionInfo["source"]; connectionType?: string }[] = [];
    const probeContext = getProbeRuntimeContext();

    const pushCandidate = (
      candidate: {
        url: string;
        priority: number;
        source: ConnectionInfo["source"];
        connectionType?: string;
      },
      reason: string
    ) => {
      if (!canProbeCandidateUrl(candidate.url, probeContext)) {
        log.debug("Skipping candidate blocked in secure web context", {
          url: candidate.url,
          reason,
        });
        return;
      }
      candidates.push(candidate);
    };

    // 1. Environment override (highest priority)
    // 1. Primary Backend (LAN/Standard) - Highest Priority
    const primaryUrl = getEnvBackendUrl();
    if (primaryUrl) {
      pushCandidate({ url: primaryUrl, priority: 60, source: "env" }, "env-primary");
      log.debug("Found Primary backend URL", { primaryUrl });
    }

    // 2. Internet Fallback (Tunnel)
    const internetUrl = process.env.EXPO_PUBLIC_INTERNET_BACKEND_URL;
    if (internetUrl) {
      pushCandidate(
        { url: normalizeUrl(internetUrl), priority: 50, source: "env" },
        "env-internet-fallback"
      );
      log.debug("Found Internet backend URL", { internetUrl });
    }

    // 2.5 Remote Configuration (Discovery)
    const configUrl = process.env.EXPO_PUBLIC_CONFIG_URL;
    if (configUrl) {
      try {
        log.info("Fetching remote configuration...", { configUrl });
        const response = await fetch(configUrl);
        if (response.ok) {
          const data = await response.json();
          if (data && data.backendUrl) {
            const remoteUrl = normalizeUrl(data.backendUrl);
            pushCandidate(
              { url: remoteUrl, priority: 55, source: "env" },
              "remote-config"
            ); // Priority above static Env, below LAN
            log.info("Discovered remote backend URL", { remoteUrl });
          }
        }
      } catch (e) {
        log.warn("Failed to fetch remote configuration", e);
      }
    }

    // 2.6 Cloud Tunnel Fallback (from environment config, never hardcoded)
    const tunnelUrl = process.env.EXPO_PUBLIC_TUNNEL_URL;
    if (tunnelUrl) {
      pushCandidate(
        {
          url: normalizeUrl(tunnelUrl),
          priority: 45,
          source: "env",
          connectionType: "TUNNEL",
        },
        "env-tunnel-fallback"
      );
    }

    // 3. mDNS discovery
    const mdnsPort = parseInt(process.env.EXPO_PUBLIC_BACKEND_PORT || "", 10) || 8001;
    pushCandidate(
      {
        url: `http://${MDNS_HOST}:${mdnsPort}`,
        priority: 30,
        source: "mdns",
      },
      "mdns"
    );

    // 3. QR scan fallback (persisted)
    try {
      const qrUrl = await AsyncStorage.getItem(QR_STORAGE_KEY);
      if (qrUrl) {
        pushCandidate({ url: qrUrl, priority: 10, source: "qr" }, "qr");
      }
    } catch (error) {
      log.debug("Could not load QR backend URL", error);
    }

    // Remove duplicates and sort by priority
    const unique = Array.from(new Map(candidates.map((c) => [c.url, c])).values()).sort(
      (a, b) => b.priority - a.priority
    );

    log.debug("Built connection candidates", unique);
    return unique as { url: string; priority: number; source: ConnectionInfo["source"] }[];
  }

  /**
   * Find first healthy connection from candidates with retry logic
   */
  private async findHealthyConnection(
    candidates: { url: string; priority: number; source?: ConnectionInfo["source"] }[]
  ): Promise<ConnectionInfo | null> {
    log.info(`Probing ${candidates.length} candidates in parallel...`);

    const probePromises = candidates.map(async (candidate) => {
      try {
        const isHealthy = await this.checkHealthWithRetry(candidate.url);
        if (isHealthy.healthy) {
          const url = new URL(candidate.url);

          let type: ConnectionInfo["connectionType"] =
            (candidate as any).connectionType || "MANUAL";
          if (candidate.priority === 60) type = "LAN";
          else if (candidate.priority >= 45 && candidate.priority <= 50)
            type = "TUNNEL";

          return {
            backendUrl: candidate.url,
            backendPort: parseInt(url.port) || 8001,
            backendIp: url.hostname,
            lastChecked: new Date().toISOString(),
            isHealthy: true,
            latencyMs: isHealthy.latencyMs,
            source: candidate.source || "unknown",
            connectionType: type,
            isEnvLocked: candidate.source === "env",
            priority: candidate.priority,
          };
        }
      } catch (error) {
        log.debug(`Probe failed for ${candidate.url}`, error);
      }
      return null;
    });

    const results = await Promise.all(probePromises);

    // Filter out nulls and sort by priority, then latency
    const successful = (
      results.filter((res) => res !== null) as (ConnectionInfo & { priority: number })[]
    ).sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (a.latencyMs || 9999) - (b.latencyMs || 9999);
    });

    if (successful.length > 0) {
      const best = successful[0]!;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { priority, ...connectionInfo } = best;
      return connectionInfo as ConnectionInfo;
    }

    log.warn("All parallel connection attempts failed");
    return null;
  }

  /**
   * Check if backend is healthy with retry logic and latency measurement
   */
  private async checkHealthWithRetry(
    url: string
  ): Promise<{ healthy: boolean; latencyMs?: number }> {
    const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const pathPromises = HEALTH_PATHS.map(async (healthPath) => {
        try {
          const startTime = Date.now();
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

          const response = await fetch(`${baseUrl}${healthPath}`, {
            method: "GET",
            headers: buildHealthProbeHeaders(),
            signal: controller.signal,
          });

          clearTimeout(timeout);
          const latency = Date.now() - startTime;

          if (response.ok) {
            log.debug(`Health check successful for ${url}${healthPath} (attempt ${attempt})`, {
              latency,
            });
            return { healthy: true, latencyMs: latency };
          }

          log.debug(`Health check failed for ${url}${healthPath} (attempt ${attempt})`, {
            status: response.status,
            latency,
          });
          return null;
        } catch (error: any) {
          if (error && error.name !== "AbortError") {
            log.debug(`Health check error for ${url}${healthPath} (attempt ${attempt})`, {
              error: error instanceof Error ? error.message : String(error),
            });
          }
          return null;
        }
      });

      const results = await Promise.all(pathPromises);
      const successful = results.find((r) => r !== null && r.healthy);
      if (successful) return successful;

      // Wait before retry (except on last attempt)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    return { healthy: false };
  }

  /**
   * Set fallback connection when no healthy backend is found
   */
  private setFallbackConnection(error?: string): void {
    const fallback: ConnectionInfo = {
      backendUrl: "",
      backendPort: 0,
      backendIp: "",
      lastChecked: new Date().toISOString(),
      isHealthy: false,
      source: "unknown",
      errorCode: "NO_BACKEND_FOUND",
      lastError: error || "NO_BACKEND_FOUND",
      errorCount: 1,
    };

    this.currentConnection = fallback;
    this.saveConnection(fallback);
    this.notifyListeners(fallback);

    log.warn("Using fallback connection", { error, fallback });
  }

  /**
   * Set current connection and notify listeners
   */
  private async setCurrentConnection(connection: ConnectionInfo): Promise<void> {
    this.currentConnection = connection;
    await this.saveConnection(connection);
    this.notifyListeners(connection);
  }

  /**
   * Save connection to persistent storage
   */
  private async saveConnection(connection: ConnectionInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
    } catch (error) {
      log.error("Failed to save connection", error);
    }
  }

  /**
   * Notify all listeners of connection change
   */
  private notifyListeners(connection: ConnectionInfo): void {
    this.listeners.forEach((listener) => {
      try {
        listener(connection);
      } catch (error) {
        log.error("Error in connection listener", error);
      }
    });
  }

  /**
   * Start periodic health monitoring with improved error tracking
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(async () => {
      if (this.currentConnection && this.currentConnection.backendUrl) {
        const envUrl = getEnvBackendUrl();
        const isEnvLocked = !!envUrl;
        const wasHealthy = this.currentConnection.isHealthy;
        const healthResult = await this.checkHealthWithRetry(this.currentConnection.backendUrl);

        const isHealthy = healthResult.healthy;
        const latency = healthResult.latencyMs;

        if (wasHealthy !== isHealthy) {
          // Health status changed, update connection
          const updatedConnection = {
            ...this.currentConnection,
            isHealthy,
            lastChecked: new Date().toISOString(),
            latencyMs: latency,
            lastError: isHealthy ? undefined : `Health check failed after ${MAX_RETRIES} attempts`,
            errorCode: isHealthy ? undefined : isEnvLocked ? "ENV_BACKEND_UNREACHABLE" : undefined,
            isEnvLocked,
          };

          await this.setCurrentConnection(updatedConnection);
        } else if (!isHealthy) {
          // Connection still unhealthy, increment error count
          const updatedConnection = {
            ...this.currentConnection,
            errorCount: (this.currentConnection.errorCount || 0) + 1,
            lastChecked: new Date().toISOString(),
            lastError: `Health check failed (attempt ${this.currentConnection.errorCount || 0 + 1})`,
            errorCode: isEnvLocked ? "ENV_BACKEND_UNREACHABLE" : undefined,
            isEnvLocked,
          };

          await this.setCurrentConnection(updatedConnection);
        } else {
          // Connection healthy, reset error count
          const updatedConnection = {
            ...this.currentConnection,
            isHealthy: true,
            lastChecked: new Date().toISOString(),
            latencyMs: latency,
            errorCount: 0,
            lastError: undefined,
            errorCode: undefined,
            isEnvLocked,
          };

          await this.setCurrentConnection(updatedConnection);
        }

        // If current connection is unhealthy, try to find new one
        if (!isHealthy && (this.currentConnection.errorCount || 0) >= MAX_RETRIES) {
          log.info("Current connection unhealthy after multiple failures, re-detecting...");
          await this.detectAndSetConnection();
        }
      }
    }, HEALTH_CHECK_INTERVAL);
  }

  /**
   * Stop health monitoring
   */
  public stopHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get current connection info
   */
  public getConnection(): ConnectionInfo | null {
    return this.currentConnection;
  }

  /**
   * Add listener for connection changes
   */
  public addListener(listener: (connection: ConnectionInfo) => void): void {
    this.listeners.push(listener);

    // Immediately notify with current connection
    if (this.currentConnection) {
      listener(this.currentConnection);
    }
  }

  /**
   * Remove listener
   */
  public removeListener(listener: (connection: ConnectionInfo) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Manual reconnection attempt
   */
  public async reconnect(): Promise<ConnectionInfo> {
    log.info("Manual reconnection requested");
    return await this.detectAndSetConnection();
  }

  /**
   * Force update backend URL
   */
  public async setBackendUrl(url: string): Promise<void> {
    try {
      const envUrl = getEnvBackendUrl();
      if (envUrl) {
        // Just log that we have an env url, but allow override
        log.debug("Env URL present, but establishing manual override", { envUrl });
      }

      const urlObj = new URL(url);
      const connection: ConnectionInfo = {
        backendUrl: url,
        backendPort: parseInt(urlObj.port) || 8001,
        backendIp: urlObj.hostname,
        lastChecked: new Date().toISOString(),
        isHealthy: await this.checkHealth(url),
        source: "qr",
      };

      await AsyncStorage.setItem(QR_STORAGE_KEY, url);
      await this.setCurrentConnection(connection);
      log.info("Backend URL manually updated", connection);
    } catch (error) {
      log.error("Failed to set backend URL", error);
    }
  }

  /**
   * Check health of specific URL
   */
  public async checkHealth(url: string): Promise<boolean> {
    const result = await this.checkHealthWithRetry(url);
    return result.healthy;
  }
}

export default ConnectionManager;
export type { ConnectionInfo };
