import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Item } from "../types/scan";

const RECENT_ITEMS_KEY = "stock_verify_recent_items";
const ANALYTICS_EVENTS_KEY = "stock_verify_analytics_events";
const MAX_ANALYTICS_EVENTS = 200;
const MAX_RECENT_ACTIVITY = 20;

/** Recent item with scan timestamp */
export interface RecentItem extends Item {
  scanned_at: string;
  floor_no?: string;
  rack_no?: string;
  counted_qty?: number;
}

/** Generic analytics data payload */
type AnalyticsData = Record<string, string | number | boolean | undefined>;

interface AnalyticsEventRecord {
  event_name: string;
  data: AnalyticsData;
  tracked_at: string;
}

const safeReadAnalyticsEvents = async (): Promise<AnalyticsEventRecord[]> => {
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading analytics events:", error);
    return [];
  }
};

const safeWriteAnalyticsEvents = async (
  events: AnalyticsEventRecord[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      ANALYTICS_EVENTS_KEY,
      JSON.stringify(events.slice(-MAX_ANALYTICS_EVENTS)),
    );
  } catch (error) {
    console.error("Error writing analytics events:", error);
  }
};

const getDataString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const getDataNumber = (value: unknown): number | undefined => {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const getEventSessionId = (data: AnalyticsData): string | undefined => {
  const legacy = getDataString(data.session_id);
  if (legacy) return legacy;
  return getDataString(data.sessionId);
};

const toRecentItemFromEvent = (event: AnalyticsEventRecord): RecentItem | null => {
  const itemCode = getDataString(event.data.item_code);
  const barcode = getDataString(event.data.barcode);
  const identifier = itemCode || barcode;
  if (!identifier) return null;

  const itemName =
    getDataString(event.data.item_name) ||
    getDataString(event.data.name) ||
    identifier;

  const scannedAt =
    getDataString(event.data.timestamp) ||
    getDataString(event.data.scanned_at) ||
    event.tracked_at;

  return {
    id: getDataString(event.data.id) || identifier,
    name: itemName,
    item_code: itemCode || identifier,
    barcode,
    counted_qty:
      getDataNumber(event.data.counted_qty) ??
      getDataNumber(event.data.quantity),
    floor_no: getDataString(event.data.floor_no),
    rack_no: getDataString(event.data.rack_no),
    scanned_at: scannedAt,
  };
};

export const AnalyticsService = {
  trackCount: async (itemCode: string, quantity: number) => {
    await AnalyticsService.trackEvent("count_tracked", {
      item_code: itemCode,
      counted_qty: quantity,
      timestamp: new Date().toISOString(),
    });
  },
  trackItemScan: async (itemCode: string, itemName: string) => {
    await AnalyticsService.trackEvent("item_scanned", {
      item_code: itemCode,
      item_name: itemName,
      timestamp: new Date().toISOString(),
    });
  },
  getRecentActivity: async (sessionId: string): Promise<RecentItem[]> => {
    const events = await safeReadAnalyticsEvents();
    const scopedEvents = events.filter((event) => {
      const eventSessionId = getEventSessionId(event.data);
      return !sessionId || eventSessionId === sessionId;
    });

    const mappedActivity = scopedEvents
      .map(toRecentItemFromEvent)
      .filter((item): item is RecentItem => item !== null)
      .sort((a, b) => {
        const at = new Date(a.scanned_at).getTime();
        const bt = new Date(b.scanned_at).getTime();
        return bt - at;
      })
      .slice(0, MAX_RECENT_ACTIVITY);

    if (mappedActivity.length > 0) {
      return mappedActivity;
    }

    return (await RecentItemsService.getRecent()).slice(0, MAX_RECENT_ACTIVITY);
  },
  trackEvent: async (eventName: string, data: AnalyticsData) => {
    const existing = await safeReadAnalyticsEvents();
    const nextEvent: AnalyticsEventRecord = {
      event_name: eventName,
      data,
      tracked_at: new Date().toISOString(),
    };
    await safeWriteAnalyticsEvents([...existing, nextEvent]);
  },
};

export const RecentItemsService = {
  addRecent: async (itemCode: string, item: Item) => {
    try {
      const existingItems = await RecentItemsService.getRecent();

      // Remove duplicate if exists
      const filtered = existingItems.filter(
        (i) => (i.item_code || i.barcode) !== itemCode,
      );

      // Add new item to beginning
      const newItem: RecentItem = {
        ...item,
        scanned_at: new Date().toISOString(),
        item_code: itemCode, // Ensure item_code is set
      };

      const updated = [newItem, ...filtered].slice(0, 10); // Keep last 10

      await AsyncStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error adding recent item:", error);
    }
  },

  getRecent: async (): Promise<RecentItem[]> => {
    try {
      const items = await AsyncStorage.getItem(RECENT_ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error getting recent items:", error);
      return [];
    }
  },

  getRecentItems: async (itemCode?: string): Promise<RecentItem[]> => {
    const recentItems = await RecentItemsService.getRecent();
    if (!itemCode) return recentItems;

    const normalizedCode = itemCode.trim().toLowerCase();
    if (!normalizedCode) return recentItems;

    return recentItems.filter((item) => {
      const candidate = (item.item_code || item.barcode || "").trim().toLowerCase();
      return candidate === normalizedCode;
    });
  },

  clearRecent: async () => {
    try {
      await AsyncStorage.removeItem(RECENT_ITEMS_KEY);
    } catch (error) {
      console.error("Error clearing recent items:", error);
    }
  },
};
