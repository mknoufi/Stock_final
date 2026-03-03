import { authService } from "./auth";
import { createLogger } from "./logging";

const log = createLogger("WebSocket");

type MessageHandler = (data: any) => void;

interface WebSocketMessage {
  type: string;
  payload: any;
}

/**
 * WebSocket service for real-time communication with the backend.
 * Supports authentication, automatic reconnection, and message subscriptions.
 */
class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectInterval: number = 5000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url: string = "";
  private token: string | null = null;
  private isIntentionalDisconnect = false;

  /**
   * Connect to the WebSocket server with authentication.
   * @param baseUrl - Base URL (e.g., "ws://192.168.1.100:8001")
   * @param endpoint - Endpoint path (e.g., "/api/ws/supervisor")
   */
  async connect(baseUrl: string, endpoint: string = "/ws/updates") {
    // Get auth token
    this.token = await authService.getAccessToken();
    if (!this.token) {
      log.error("No auth token available");
      return;
    }

    // Build WebSocket URL with token as query param
    this.url = `${baseUrl}${endpoint}?token=${this.token}`;
    this.isIntentionalDisconnect = false;

    this._connect();
  }

  private _connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      log.warn("Already connected");
      return;
    }

    log.info("Connecting", { url: this.url.replace(/token=[^&]+/, "token=***") });

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      log.info("Connected");
      // Clear any pending reconnect timers
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        const { type, payload } = message;
        this.notify(type, payload);
      } catch (error) {
        log.error("Error parsing message", { error });
      }
    };

    this.ws.onclose = (event) => {
      log.info("Disconnected", { code: event.code, reason: event.reason || "none" });
      this.ws = null;

      // Only attempt reconnection if not intentionally disconnected
      if (!this.isIntentionalDisconnect) {
        log.info("Will reconnect", { delaySeconds: this.reconnectInterval / 1000 });
        this.reconnectTimer = setTimeout(() => {
          this._connect();
        }, this.reconnectInterval);
      }
    };

    this.ws.onerror = (error) => {
      log.error("Connection error", { error });
    };
  }

  /**
   * Subscribe to a specific message type.
   * @param type - Message type to subscribe to
   * @param handler - Callback function to handle messages
   */
  subscribe(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)?.push(handler);
    log.debug("Subscribed", { type });
  }

  /**
   * Unsubscribe from a specific message type.
   * @param type - Message type to unsubscribe from
   * @param handler - Handler function to remove
   */
  unsubscribe(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      this.handlers.set(
        type,
        handlers.filter((h) => h !== handler)
      );
      log.debug("Unsubscribed", { type });
    }
  }

  /**
   * Notify all subscribers of a message type.
   * @param type - Message type
   * @param payload - Message payload
   */
  private notify(type: string, payload: any) {
    const handlers = this.handlers.get(type);
    if (handlers && handlers.length > 0) {
      log.debug("Notifying handlers", { type, count: handlers.length });
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          log.error("Handler error", { type, error });
        }
      });
    } else {
      log.warn("No handlers for message type", { type });
    }
  }

  /**
   * Send a message to the server.
   * @param type - Message type
   * @param payload - Message payload
   */
  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, payload };
      this.ws.send(JSON.stringify(message));
      log.debug("Sent message", { type });
    } else {
      log.warn("Cannot send - not connected");
    }
  }

  /**
   * Disconnect from the WebSocket server.
   * Stops automatic reconnection attempts.
   */
  disconnect() {
    log.info("Disconnecting");
    this.isIntentionalDisconnect = true;

    // Clear reconnect timer if exists
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket connection
    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    // Clear all subscriptions
    this.handlers.clear();
    log.info("Disconnected and cleaned up");
  }

  /**
   * Check if the WebSocket is currently connected.
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current connection state.
   */
  getState(): "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED" | "NONE" {
    if (!this.ws) return "NONE";

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "NONE";
    }
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();

/**
 * Example usage:
 *
 * // Connect to supervisor WebSocket
 * await webSocketService.connect("ws://192.168.1.100:8001", "/api/ws/supervisor");
 *
 * // Subscribe to session updates
 * webSocketService.subscribe("session_update", (data) => {
 *   console.log("Session updated:", data);
 * });
 *
 * // Disconnect when done
 * webSocketService.disconnect();
 */
