import { beforeEach, describe, expect, it } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AnalyticsService, RecentItemsService } from "../enhancedFeatures";

describe("AnalyticsService", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("returns session-scoped recent activity from tracked events", async () => {
    await AnalyticsService.trackEvent("count_saved", {
      session_id: "session-a",
      item_code: "ITEM-1",
      floor_no: "F1",
      rack_no: "R2",
      counted_qty: 6,
    });
    await AnalyticsService.trackEvent("count_saved", {
      session_id: "session-b",
      item_code: "ITEM-2",
      floor_no: "F9",
      rack_no: "R9",
      counted_qty: 1,
    });

    const activity = await AnalyticsService.getRecentActivity("session-a");

    expect(activity.length).toBe(1);
    expect(activity[0]).toEqual(
      expect.objectContaining({
        item_code: "ITEM-1",
        floor_no: "F1",
        rack_no: "R2",
        counted_qty: 6,
      }),
    );
  });

  it("falls back to recent scanned items when no analytics events exist", async () => {
    await RecentItemsService.addRecent("ITEM-A", {
      id: "item-1",
      name: "Item A",
      item_code: "ITEM-A",
      floor_no: "GROUND",
      rack_no: "A-1",
      counted_qty: 3,
    } as any);

    const activity = await AnalyticsService.getRecentActivity("session-missing");

    expect(activity.length).toBe(1);
    expect(activity[0]).toEqual(
      expect.objectContaining({
        item_code: "ITEM-A",
        floor_no: "GROUND",
        rack_no: "A-1",
      }),
    );
  });
});

