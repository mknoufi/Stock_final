import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import {
  checkItemScanStatus,
  getItemByBarcode,
  searchItems,
} from "@/services/api/api";
import apiClient from "@/services/httpClient";
import { RecentItemsService } from "@/services/enhancedFeatures";
import { toastService } from "@/services/utils/toastService";
import { Item } from "@/types/scan";
import { getStockQty, sortItemsByStockDesc } from "@/utils/itemBatchUtils";

type MrpVariant = Record<string, any> & {
  id?: string | number;
  value?: number;
};

type ItemDetailItem = Item & {
  components?: Record<string, any>[];
  is_bundle?: boolean;
};

interface UseItemDetailDataParams {
  barcode?: string;
  sessionId?: string;
  currentFloor?: string | null;
  currentRack?: string | null;
  onBackPress: () => void;
  onMrpChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
}

export const useItemDetailData = ({
  barcode,
  sessionId,
  currentFloor,
  currentRack,
  onBackPress,
  onMrpChange,
  onQuantityChange,
}: UseItemDetailDataParams) => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ItemDetailItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mrpVariants, setMrpVariants] = useState<MrpVariant[]>([]);
  const [selectedMrpVariant, setSelectedMrpVariant] =
    useState<MrpVariant | null>(null);
  const [rawVariants, setRawVariants] = useState<ItemDetailItem[]>([]);
  const [showZeroStock, setShowZeroStock] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);

  const applyInitialMrpState = useCallback(
    (nextItem: ItemDetailItem) => {
      const variants = Array.isArray(nextItem.mrp_variants)
        ? (nextItem.mrp_variants as MrpVariant[])
        : [];

      setMrpVariants(variants);

      if (variants.length === 0) {
        setSelectedMrpVariant(null);
        onMrpChange(String(nextItem.mrp || ""));
        return;
      }

      const matchedVariant =
        variants.find((variant) => variant.value === nextItem.mrp) ||
        variants[0] ||
        null;

      setSelectedMrpVariant(matchedVariant);
      onMrpChange(
        matchedVariant?.value !== undefined
          ? String(matchedVariant.value)
          : String(nextItem.mrp || ""),
      );
    },
    [onMrpChange],
  );

  const sameNameVariants = useMemo(() => {
    if (!rawVariants.length || !item?.item_code) return [];

    const filtered = rawVariants.filter((variant) => {
      if (variant.item_code !== item.item_code) return false;
      if (variant.barcode === item.barcode) return false;
      if (!showZeroStock && getStockQty(variant) <= 0) return false;
      return true;
    });

    return sortItemsByStockDesc(filtered);
  }, [item, rawVariants, showZeroStock]);

  const handleSelectMrpVariant = useCallback(
    (variant: MrpVariant) => {
      setSelectedMrpVariant(variant);
      onMrpChange(String(variant.value ?? ""));
    },
    [onMrpChange],
  );

  const loadItem = useCallback(async () => {
    if (!barcode) return;

    setLoading(true);
    try {
      const itemData = (await getItemByBarcode(
        barcode,
        3,
        sessionId || undefined,
        currentRack || undefined,
      )) as ItemDetailItem | null;

      if (!itemData) {
        Alert.alert("Error", "Item not found");
        onBackPress();
        return;
      }

      setItem(itemData);
      applyInitialMrpState(itemData);

      if (sessionId) {
        try {
          const scanStatus = await checkItemScanStatus(
            sessionId,
            itemData.item_code || barcode,
          );

          if (scanStatus.scanned) {
            const existing = scanStatus.locations.find(
              (location: any) =>
                location.floor_no === currentFloor &&
                location.rack_no === currentRack,
            );

            if (existing) {
              onQuantityChange(String(existing.counted_qty));
              toastService.show("Loaded existing count", { type: "info" });
            }
          }
        } catch {
          // Existing count lookup is best-effort.
        }
      }

      await RecentItemsService.addRecent(
        itemData.item_code || barcode,
        itemData,
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load item");
      onBackPress();
    } finally {
      setLoading(false);
    }
  }, [
    applyInitialMrpState,
    barcode,
    currentFloor,
    currentRack,
    onBackPress,
    onQuantityChange,
    sessionId,
  ]);

  const handleRefreshStock = useCallback(async () => {
    if (!item?.barcode && !barcode) return;

    setIsRefreshing(true);
    try {
      const targetBarcode = item?.barcode || barcode;
      const response = await apiClient.get(
        `/api/v2/items/${targetBarcode}?verify_sql=true`,
      );

      if (response.data.success && response.data.data) {
        setItem((previous) => ({
          ...previous,
          ...response.data.data,
          _source: "sql",
        }));
        toastService.show("Stock refreshed from SQL", { type: "success" });
      }
    } catch (error: any) {
      if (error.response?.status === 503) {
        toastService.show("SQL Server unavailable", { type: "warning" });
      } else {
        toastService.show("Failed to refresh stock", { type: "error" });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [barcode, item]);

  useEffect(() => {
    void loadItem();
  }, [loadItem]);

  useEffect(() => {
    if (!item?.item_code) {
      setRawVariants([]);
      setBatchError(null);
      return;
    }

    const loadVariants = async () => {
      setBatchLoading(true);
      setBatchError(null);

      try {
        const response = await apiClient.get(
          `/api/item-batches/${encodeURIComponent(item.item_code)}`,
        );
        const data = response.data || {};
        const batches = Array.isArray(data.batches) ? data.batches : [];

        const mappedBatches = batches.map((batch: any) => {
          const stockQty = getStockQty(batch);
          return {
            ...batch,
            item_code: batch.item_code ?? item.item_code,
            barcode: batch.barcode ?? batch.auto_barcode ?? "",
            stock_qty: stockQty,
            current_stock: stockQty,
            mrp: batch.mrp ?? null,
            manufacturing_date:
              batch.manufacturing_date ?? batch.mfg_date ?? null,
          };
        });

        setRawVariants(mappedBatches);
      } catch (error) {
        console.warn("Failed to load batches:", error);
        try {
          const results = await searchItems(item.item_code);
          setRawVariants((results.items || []) as ItemDetailItem[]);
        } catch (fallbackError) {
          console.warn("Batch fallback search failed:", fallbackError);
          setRawVariants([]);
        }
        setBatchError("Batch data unavailable while ERP is offline.");
      } finally {
        setBatchLoading(false);
      }
    };

    void loadVariants();
  }, [item]);

  return {
    batchError,
    batchLoading,
    handleRefreshStock,
    handleSelectMrpVariant,
    isRefreshing,
    item,
    loading,
    mrpVariants,
    rawVariantsCount: rawVariants.length,
    sameNameVariants,
    selectedMrpVariant,
    setShowZeroStock,
    showZeroStock,
  };
};
