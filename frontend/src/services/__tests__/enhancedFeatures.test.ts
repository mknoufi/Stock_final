import { describe, it, expect, beforeEach } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RecentItemsService } from "../enhancedFeatures";

describe("RecentItemsService", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("filters recent items by item code when provided", async () => {
    await RecentItemsService.addRecent("ITEM-A", {
      id: "1",
      name: "Item A",
      item_code: "ITEM-A",
    });
    await RecentItemsService.addRecent("ITEM-B", {
      id: "2",
      name: "Item B",
      item_code: "ITEM-B",
    });

    const filtered = await RecentItemsService.getRecentItems("ITEM-A");

    expect(filtered.length).toBe(1);
    expect(filtered[0]?.item_code).toBe("ITEM-A");
  });
});
