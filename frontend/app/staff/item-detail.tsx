/**
 * Modern Item Detail Screen - Lavanya Mart Stock Verify
 * Clean, efficient item verification interface
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  InteractionManager,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useDebounce } from "use-debounce";
import { Image } from "expo-image";

import { useScanSessionStore } from "@/store/scanSessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  getItemByBarcode,
  createCountLine,
  saveDraft,
  checkItemScanStatus,
  searchItems,
  checkSerialUniqueness,
} from "@/services/api/api";
import apiClient from "@/services/httpClient";
import { RecentItemsService } from "@/services/enhancedFeatures";
import { toastService } from "@/services/utils/toastService";
import {
  CreateCountLinePayload,
  SerialEntryData,
  DateFormatType,
} from "@/types/scan";
import {
  normalizeSerialValue,
  validateSerialNumber,
  validateSerialNumbers,
} from "@/utils/scanUtils";
import { SerialScannerModal } from "@/components/modals/SerialScannerModal";

import ModernHeader from "@/components/ui/ModernHeader";
import ModernCard from "@/components/ui/ModernCard";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import {
  colors,
  semanticColors,
  spacing,
  fontSize,
  fontWeight,
  radius as borderRadius,
  shadows,
} from "@/theme/unified";

export default function ItemDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ barcode: string; sessionId: string }>();
  const { barcode, sessionId } = params;
  const normalizedSessionId = Array.isArray(sessionId)
    ? sessionId[0]
    : sessionId;
  const { currentFloor, currentRack } = useScanSessionStore();
  const { settings } = useSettingsStore();

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form State
  const [quantity, setQuantity] = useState("0");
  const [mrp, setMrp] = useState("");
  const [mrpEditable, setMrpEditable] = useState(false);
  const [condition] = useState("Good");
  const [remark, setRemark] = useState("");

  // Serial Number State - Enhanced for serialized items with per-serial MRP/mfg date
  const [serialEntries, setSerialEntries] = useState<SerialEntryData[]>([]);
  const [isSerializedItem, setIsSerializedItem] = useState(false);
  const [serialValidationErrors, setSerialValidationErrors] = useState<
    string[]
  >([]);
  const [showSerialScanner, setShowSerialScanner] = useState(false);

  // Legacy array for backward compatibility
  const serialNumbers = useMemo(
    () => serialEntries.map((e) => e.serial_number),
    [serialEntries],
  );

  const [varianceRemark, setVarianceRemark] = useState("");
  const [mrpVariants, setMrpVariants] = useState<any[]>([]);
  const [selectedMrpVariant, setSelectedMrpVariant] = useState<any>(null);

  // Variants with same item code (Batches)
  const [rawVariants, setRawVariants] = useState<any[]>([]);
  const [showZeroStock, setShowZeroStock] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);

  // Split Count State
  const [splitCounts, setSplitCounts] = useState<string[]>([]);
  const [isSplitMode, setIsSplitMode] = useState(false);

  const sameNameVariants = useMemo(() => {
    if (!rawVariants.length || !item?.item_code) return [];
    return rawVariants.filter((v: any) => {
      // Only show variants with the same item code (batch criteria)
      if (v.item_code !== item.item_code) return false;
      // Exclude current item (same barcode)
      if (v.barcode === item?.barcode) return false;
      // Filter by stock if not showing zero stock
      if (!showZeroStock && (v.stock_qty || v.current_stock || 0) <= 0)
        return false;
      return true;
    });
  }, [rawVariants, showZeroStock, item]);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (normalizedSessionId) {
      router.replace({
        pathname: "/staff/scan",
        params: { sessionId: normalizedSessionId },
      });
      return;
    }

    router.replace("/staff/home");
  }, [normalizedSessionId, router]);

  // Submit Delay State (FR-M-20)
  const [submitCountdown, setSubmitCountdown] = useState<number | null>(null);
  const submitTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Damage State
  const [isDamageEnabled, setIsDamageEnabled] = useState(false);
  const [damageQty, setDamageQty] = useState("");
  const [damageType, setDamageType] = useState<"returnable" | "nonreturnable">(
    "returnable",
  );
  const [damagePhoto, setDamagePhoto] = useState<string | null>(null);
  const [itemPhotos, setItemPhotos] = useState<string[]>([]);

  // Manufacturing & Expiry Date State (for item-level or non-serialized items)
  const [hasMfgDate, setHasMfgDate] = useState(false);
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [itemMfgDate, setItemMfgDate] = useState("");
  const [itemMfgDateFormat, setItemMfgDateFormat] =
    useState<DateFormatType>("full");
  const [itemExpiryDate, setItemExpiryDate] = useState("");
  const [itemExpiryDateFormat, setItemExpiryDateFormat] =
    useState<DateFormatType>("full");

  const isMfgFull = itemMfgDateFormat === "full";
  const isMfgMonthYear = itemMfgDateFormat === "month_year";
  const isExpiryFull = itemExpiryDateFormat === "full";
  const isExpiryMonthYear = itemExpiryDateFormat === "month_year";

  const [isInteractionsComplete, setIsInteractionsComplete] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsInteractionsComplete(true);
    });
    return () => task.cancel();
  }, []);

  const loadItem = useCallback(async () => {
    if (!barcode) return;
    setLoading(true);
    try {
      const itemData = await getItemByBarcode(
        barcode,
        3,
        sessionId || undefined,
        currentRack || undefined,
      );
      if (itemData) {
        setItem(itemData);
        setMrp(String(itemData.mrp || ""));

        // Serial capture is now user-controlled via toggle
        // User can enable it for items that require serial tracking
        setIsSerializedItem(false);
        setSerialEntries([]);

        // Handle MRP Variants
        if (
          itemData.mrp_variants &&
          Array.isArray(itemData.mrp_variants) &&
          itemData.mrp_variants.length > 0
        ) {
          setMrpVariants(itemData.mrp_variants);
          // Default to the first one or the one matching current MRP
          const variants = itemData.mrp_variants as any[];
          const match = variants.find((v: any) => v.value === itemData.mrp);
          const selected = match || variants[0];
          setSelectedMrpVariant(selected);
          if (selected) {
            setMrp(String(selected.value));
          }
        }

        // Check for existing count
        try {
          const scanStatus = await checkItemScanStatus(
            sessionId!,
            itemData.item_code || barcode,
          );
          if (scanStatus.scanned) {
            const existing = scanStatus.locations.find(
              (loc: any) =>
                loc.floor_no === currentFloor && loc.rack_no === currentRack,
            );
            if (existing) {
              setQuantity(String(existing.counted_qty));
              toastService.show("Loaded existing count", { type: "info" });
            }
          }
        } catch (_) {
          // Ignore
        }

        await RecentItemsService.addRecent(
          itemData.item_code || barcode,
          itemData,
        );
      } else {
        Alert.alert("Error", "Item not found");
        handleBackPress();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load item");
      handleBackPress();
    } finally {
      setLoading(false);
    }
  }, [barcode, sessionId, currentFloor, currentRack, handleBackPress]);

  const handleRefreshStock = useCallback(async () => {
    if (!item?.barcode && !barcode) return;
    setIsRefreshing(true);
    try {
      const targetBarcode = item?.barcode || barcode;
      // Use V2 GET endpoint with verify_sql=true to trigger SQL refresh
      // Path definition in backend/api/v2/__init__.py confirms /api/v2/items prefix
      const response = await apiClient.get(
        `/api/v2/items/${targetBarcode}?verify_sql=true`
      );

      if (response.data.success && response.data.data) {
        setItem((prev: any) => ({
          ...prev,
          ...response.data.data,
          _source: "sql", // Updates source indicator to SQL
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
  }, [item, barcode]);


  useEffect(() => {
    loadItem();
  }, [loadItem]);

  // Load variants with same name
  useEffect(() => {
    if (!item?.item_code) return;

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
          const stockQty = batch.stock_qty ?? batch.current_stock ?? 0;
          return {
            ...batch,
            item_code: batch.item_code ?? item.item_code,
            barcode: batch.barcode ?? batch.auto_barcode ?? "",
            stock_qty: stockQty,
            current_stock: stockQty,
            manufacturing_date:
              batch.manufacturing_date ?? batch.mfg_date ?? null,
          };
        });
        setRawVariants(mappedBatches);
      } catch (error) {
        console.warn("Failed to load batches:", error);
        try {
          const results = await searchItems(item.item_code);
          setRawVariants(results.items || []);
        } catch (fallbackError) {
          console.warn("Batch fallback search failed:", fallbackError);
          setRawVariants([]);
        }
        setBatchError("Batch data unavailable while ERP is offline.");
      } finally {
        setBatchLoading(false);
      }
    };

    loadVariants();
  }, [item]);

  // Auto-save draft effect
  const [debouncedFormData] = useDebounce(
    {
      quantity,
      mrp,
      remark,
      serialEntries,
    },
    2000, // 2 seconds debounce
  );

  useEffect(() => {
    if (!item || !sessionId || quantity === "0" || submitting) return;

    const performAutosave = async () => {
      const payload: CreateCountLinePayload = {
        session_id: sessionId,
        item_code: item.item_code,
        counted_qty: parseFloat(quantity) || 0,
        mrp_counted: parseFloat(mrp) || item.mrp,
        remark,
        floor_no: currentFloor || null,
        rack_no: currentRack || null,
        // Add other necessary fields for the payload...
      };

      await saveDraft(payload);
    };

    performAutosave();
  }, [
    debouncedFormData,
    item,
    sessionId,
    quantity,
    mrp,
    remark,
    submitting,
    currentFloor,
    currentRack,
  ]);

  // UOM Information - Precision and Behavior mapping
  const uomInfo = useMemo(() => {
    const uom = (
      item?.uom ||
      item?.uom_name ||
      item?.uom_code ||
      ""
    ).toLowerCase();

    // Weight based - 3 decimal places (kg/g)
    if (
      uom.includes("kg") ||
      uom.includes("gram") ||
      uom.includes("gm") ||
      uom.includes("kilogram")
    ) {
      return { precision: 3, label: "Weight", step: 0.05, unit: "kg" };
    }

    // Volume based - 2 decimal places (Liter/ML)
    if (
      uom.includes("liter") ||
      uom.includes("litre") ||
      uom.includes("ml") ||
      uom.includes("mtr")
    ) {
      return { precision: 2, label: "Volume", step: 0.1, unit: "L" };
    }

    // Length/Area based - 2 decimal places
    if (uom.includes("meter") || uom.includes("mtr") || uom.includes("sqft")) {
      return { precision: 2, label: "Measurement", step: 0.1, unit: uom };
    }

    // Default: Integer count (Pcs, Box, Set)
    return { precision: 0, label: "Count", step: 1, unit: uom || "Pcs" };
  }, [item]);

  const isWeightBasedUOM = uomInfo.precision > 0;

  // Format quantity based on UOM precision
  const formatQuantity = useCallback(
    (value: string | number): string => {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) return "0";

      if (uomInfo.precision > 0) {
        // Use mapped precision for decimal items
        return num.toFixed(uomInfo.precision).replace(/\.?0+$/, "") || "0";
      } else {
        // Integer only for unit-based items
        return Math.floor(num).toString();
      }
    },
    [uomInfo.precision],
  );

  // Handle quantity change with UOM validation
  const handleQuantityChange = useCallback(
    (value: string) => {
      // Allow empty or partial input while typing
      if (value === "" || value === "." || value === "0.") {
        setQuantity(value);
        return;
      }

      // Validate input format based on UOM precision
      if (uomInfo.precision > 0) {
        // Allow decimals up to the specified precision
        const regex = new RegExp(`^\\d*\\.?\\d{0,${uomInfo.precision}}$`);
        if (regex.test(value)) {
          setQuantity(value);
        }
      } else {
        // Only allow integers
        const regex = /^\d*$/;
        if (regex.test(value)) {
          setQuantity(value);
        }
      }
    },
    [uomInfo.precision],
  );

  // Get quantity step for +/- buttons
  const getQuantityStep = useCallback((): number => {
    return uomInfo.step;
  }, [uomInfo.step]);

  // Handle Split Count summation
  useEffect(() => {
    if (isSplitMode && splitCounts.length > 0) {
      const sum = splitCounts.reduce(
        (acc, curr) => acc + (parseFloat(curr) || 0),
        0,
      );
      setQuantity(formatQuantity(sum));
    }
  }, [splitCounts, isSplitMode, formatQuantity]);

  const formatBatchDate = useCallback((value?: string | null): string => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }
    return parsed.toLocaleDateString();
  }, []);

  // Sync quantity with serial entries count for serialized items
  // When serials are scanned, quantity auto-updates
  useEffect(() => {
    if (isSerializedItem && serialEntries.length > 0) {
      setQuantity(String(serialEntries.length));
    }
  }, [serialEntries.length, isSerializedItem]);

  // Serial number handling functions
  const handleSerialChange = useCallback(
    (index: number, field: keyof SerialEntryData, value: string | number) => {
      setSerialEntries((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            [field]:
              field === "serial_number" ? String(value).toUpperCase() : value,
          };
        }
        return updated;
      });
      // Clear validation errors when user types
      setSerialValidationErrors([]);
    },
    [],
  );

  // Handle scanned serial from SerialScannerModal (auto-increments quantity)
  const handleSerialScanned = useCallback(
    async (data: {
      serial_number: string;
      mrp?: number;
      manufacturing_date?: string;
    }) => {
      const normalized = data.serial_number.trim().toUpperCase();

      // local duplicate check
      const isLocalDuplicate = serialEntries.some(
        (e) => e.serial_number.toUpperCase() === normalized,
      );
      if (isLocalDuplicate) {
        Alert.alert(
          "Duplicate Serial",
          "This serial number is already in your list.",
        );
        return;
      }

      // global uniqueness check
      if (sessionId) {
        const result = await checkSerialUniqueness(sessionId, normalized);
        if (result.exists) {
          Alert.alert(
            "Serial Already Counted",
            `Serial ${normalized} was already counted in this session.\n\n` +
            `Item: ${result.item_name || result.item_code}\n` +
            `Location: Floor ${result.floor_no}, Rack ${result.rack_no}\n` +
            `Counted by: ${result.counted_by}`,
            [{ text: "OK" }],
          );
          return;
        }
      }

      const newEntry: SerialEntryData = {
        id: `serial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        serial_number: data.serial_number,
        mrp: data.mrp ?? parseFloat(mrp) ?? item?.mrp,
        manufacturing_date: data.manufacturing_date ?? item?.manufacturing_date,
        scanned_at: new Date().toISOString(),
        is_valid: true,
      };

      setSerialEntries((prev) => [...prev, newEntry]);
      // Quantity auto-increments via useEffect above
    },
    [mrp, item, serialEntries, sessionId],
  );

  // Add empty serial entry for manual input
  const handleAddSerial = useCallback(() => {
    const newEntry: SerialEntryData = {
      id: `serial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serial_number: "",
      mrp: parseFloat(mrp) ?? item?.mrp,
      manufacturing_date: item?.manufacturing_date,
      is_valid: false,
    };
    setSerialEntries((prev) => [...prev, newEntry]);
  }, [mrp, item]);

  const handleRemoveSerial = useCallback(
    (index: number) => {
      if (serialEntries.length <= 1) {
        // If it's the last entry, just clear it
        setSerialEntries([
          {
            id: `serial_${Date.now()}`,
            serial_number: "",
            mrp: parseFloat(mrp) || item?.mrp,
            is_valid: false,
          },
        ]);
        return;
      }
      setSerialEntries((prev) => prev.filter((_, i) => i !== index));
    },
    [serialEntries.length, mrp, item],
  );

  // Date format options for flexible date input
  const DATE_FORMAT_OPTIONS: {
    value: DateFormatType;
    label: string;
    placeholder: string;
  }[] = [
      { value: "full", label: "Full Date", placeholder: "DD/MM/YYYY" },
      { value: "month_year", label: "Month & Year", placeholder: "MM/YYYY" },
      { value: "year_only", label: "Year Only", placeholder: "YYYY" },
    ];

  // Local pieces for picker-based date selection
  const [mfgDay, setMfgDay] = useState<string>("");
  const [mfgMonth, setMfgMonth] = useState<string>("");
  const [mfgYear, setMfgYear] = useState<string>("");
  const [expiryDay, setExpiryDay] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [selectVisible, setSelectVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [selectTitle, setSelectTitle] = useState("");
  const [selectType, setSelectType] = useState<"day" | "month" | "year" | null>(
    null,
  );
  const [selectFor, setSelectFor] = useState<"mfg" | "exp" | null>(null);

  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const earliestYear = currentYear - 10; // last 10 years

  // Initialize parts when itemMfgDate changes (or when format changes)
  useEffect(() => {
    if (!itemMfgDate) {
      setMfgDay("");
      setMfgMonth("");
      setMfgYear("");
      return;
    }
    const parts = itemMfgDate.split("/");
    if (itemMfgDateFormat === "full" && parts.length === 3) {
      setMfgDay(parts[0] ?? "");
      setMfgMonth(parts[1] ?? "");
      setMfgYear(parts[2] ?? "");
    } else if (itemMfgDateFormat === "month_year" && parts.length === 2) {
      setMfgDay("");
      setMfgMonth(parts[0] ?? "");
      setMfgYear(parts[1] ?? "");
    } else if (itemMfgDateFormat === "year_only") {
      setMfgDay("");
      setMfgMonth("");
      setMfgYear(parts[0] || "");
    }
  }, [itemMfgDate, itemMfgDateFormat]);

  // Initialize parts when itemExpiryDate changes (or when format changes)
  useEffect(() => {
    if (!itemExpiryDate) {
      setExpiryDay("");
      setExpiryMonth("");
      setExpiryYear("");
      return;
    }
    const parts = itemExpiryDate.split("/");
    if (itemExpiryDateFormat === "full" && parts.length === 3) {
      setExpiryDay(parts[0] ?? "");
      setExpiryMonth(parts[1] ?? "");
      setExpiryYear(parts[2] ?? "");
    } else if (itemExpiryDateFormat === "month_year" && parts.length === 2) {
      setExpiryDay("");
      setExpiryMonth(parts[0] ?? "");
      setExpiryYear(parts[1] ?? "");
    } else if (itemExpiryDateFormat === "year_only") {
      setExpiryDay("");
      setExpiryMonth("");
      setExpiryYear(parts[0] || "");
    }
  }, [itemExpiryDate, itemExpiryDateFormat]);

  // Compose itemMfgDate from parts
  const composeMfgDate = useCallback(() => {
    if (itemMfgDateFormat === "full") {
      if (!mfgDay || !mfgMonth || !mfgYear) return "";
      return `${mfgDay.padStart(2, "0")}/${mfgMonth.padStart(2, "0")}/${mfgYear}`;
    }
    if (itemMfgDateFormat === "month_year") {
      if (!mfgMonth || !mfgYear) return "";
      return `${mfgMonth.padStart(2, "0")}/${mfgYear}`;
    }
    if (itemMfgDateFormat === "year_only") {
      return mfgYear || "";
    }
    return "";
  }, [mfgDay, mfgMonth, mfgYear, itemMfgDateFormat]);

  const composeExpiryDate = useCallback(() => {
    if (itemExpiryDateFormat === "full") {
      if (!expiryDay || !expiryMonth || !expiryYear) return "";
      return `${expiryDay.padStart(2, "0")}/${expiryMonth.padStart(2, "0")}/${expiryYear}`;
    }
    if (itemExpiryDateFormat === "month_year") {
      if (!expiryMonth || !expiryYear) return "";
      return `${expiryMonth.padStart(2, "0")}/${expiryYear}`;
    }
    if (itemExpiryDateFormat === "year_only") {
      return expiryYear || "";
    }
    return "";
  }, [expiryDay, expiryMonth, expiryYear, itemExpiryDateFormat]);

  const generateMonthOptions = useCallback((): string[] => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  }, []);

  const generateYearOptions = useCallback((): string[] => {
    const years: string[] = [];
    for (let y = currentYear; y >= earliestYear; y--) years.push(String(y));
    return years;
  }, [currentYear, earliestYear]);

  const generateDayOptions = useCallback((): string[] => {
    const month = Number(mfgMonth) || 1;
    const year = Number(mfgYear) || currentYear;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );
  }, [mfgMonth, mfgYear, currentYear]);

  const generateExpiryDayOptions = useCallback((): string[] => {
    const month = Number(expiryMonth) || 1;
    const year = Number(expiryYear) || currentYear;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );
  }, [expiryMonth, expiryYear, currentYear]);

  const openSelect = useCallback(
    (type: "day" | "month" | "year", target: "mfg" | "exp" = "mfg") => {
      setSelectFor(target);
      setSelectType(type);
      if (type === "day") {
        setSelectOptions(
          target === "mfg" ? generateDayOptions() : generateExpiryDayOptions(),
        );
        setSelectTitle("Select Day");
      } else if (type === "month") {
        setSelectOptions(generateMonthOptions());
        setSelectTitle("Select Month");
      } else {
        setSelectOptions(generateYearOptions());
        setSelectTitle("Select Year");
      }
      setSelectVisible(true);
    },
    [
      generateDayOptions,
      generateMonthOptions,
      generateYearOptions,
      generateExpiryDayOptions,
    ],
  );

  const onSelectOption = useCallback(
    (val: string) => {
      if (selectFor === "mfg") {
        if (selectType === "day") setMfgDay(val);
        if (selectType === "month") {
          setMfgMonth(val);
          setMfgDay("");
        }
        if (selectType === "year") {
          setMfgYear(val);
          setMfgDay("");
        }
        setSelectVisible(false);
        setTimeout(() => {
          const composed = composeMfgDate();
          setItemMfgDate(composed);
        }, 0);
        return;
      }

      if (selectFor === "exp") {
        if (selectType === "day") setExpiryDay(val);
        if (selectType === "month") {
          setExpiryMonth(val);
          setExpiryDay("");
        }
        if (selectType === "year") {
          setExpiryYear(val);
          setExpiryDay("");
        }
        setSelectVisible(false);
        setTimeout(() => {
          const composed = composeExpiryDate();
          setItemExpiryDate(composed);
        }, 0);
        return;
      }
    },
    [
      selectType,
      selectFor,
      composeMfgDate,
      composeExpiryDate,
      setItemMfgDate,
      setItemExpiryDate,
    ],
  );

  // Validate date input based on format
  const validateDateInput = useCallback(
    (input: string, format: DateFormatType): boolean => {
      if (!input) return true; // Empty is valid (optional)

      const now = new Date();

      switch (format) {
        case "full": {
          const parts = input.split("/");
          if (parts.length !== 3) return false;
          const day = Number(parts[0]);
          const month = Number(parts[1]);
          const year = Number(parts[2]);
          if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
          if (day < 1 || day > 31 || month < 1 || month > 12) return false;
          // Build date and ensure not in future
          const dt = new Date(year, month - 1, day);
          if (isNaN(dt.getTime())) return false;
          if (dt > now) return false;
          if (year < earliestYear) return false;
          return true;
        }
        case "month_year": {
          const parts = input.split("/");
          if (parts.length !== 2) return false;
          const month = Number(parts[0]);
          const year = Number(parts[1]);
          if (isNaN(month) || isNaN(year)) return false;
          if (month < 1 || month > 12) return false;
          // If same year, month must not be in future
          if (year > now.getFullYear()) return false;
          if (year === now.getFullYear() && month > now.getMonth() + 1)
            return false;
          if (year < earliestYear) return false;
          return true;
        }
        case "year_only": {
          const year = Number(input);
          if (isNaN(year)) return false;
          if (year > now.getFullYear()) return false;
          if (year < earliestYear) return false;
          return true;
        }
        default:
          return true;
      }
    },
    [earliestYear],
  );

  const validateSerials = useCallback((): boolean => {
    if (!isSerializedItem) return true;

    const qty = parseInt(quantity) || 1;
    const filledSerials = serialNumbers.filter((s) => s.trim().length > 0);

    // For serialized items, validate that we have the right count
    const validation = validateSerialNumbers(filledSerials, qty);

    if (!validation.valid) {
      setSerialValidationErrors(validation.errors);
      return false;
    }

    setSerialValidationErrors([]);
    return true;
  }, [isSerializedItem, quantity, serialNumbers]);

  const handleTakePhoto = async () => {
    Alert.alert("Photo Capture", "Photo capture is not enabled.");
  };

  const handleCaptureItemPhoto = async () => {
    Alert.alert("Photo Capture", "Photo capture is not enabled.");
  };

  const handleSubmitPress = async () => {
    if (!item || !sessionId) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid quantity");
      return;
    }

    // Validate serial numbers for serialized items (only if any are entered)
    const hasSerials = serialEntries.some(
      (e) => e.serial_number.trim().length > 0,
    );
    if (isSerializedItem && hasSerials && !validateSerials()) {
      Alert.alert(
        "Serial Number Error",
        "Please enter valid serial numbers. " +
        serialValidationErrors.join(", "),
      );
      return;
    }

    if (isDamageEnabled) {
      const dQty = parseFloat(damageQty);
      if (isNaN(dQty) || dQty <= 0) {
        Alert.alert(
          "Invalid Damage Quantity",
          "Please enter a valid damage quantity",
        );
        return;
      }

      if (!damagePhoto) {
        Alert.alert(
          "Photo Required",
          "Mandatory photo proof is required for all damage reports. Please capture a photo of the damaged item.",
        );
        return;
      }
    }

    // Start countdown instead of immediate submit (FR-M-20)
    setSubmitCountdown(5);
  };

  const executeSubmit = useCallback(async () => {
    setSubmitCountdown(null);
    setSubmitting(true);

    // Re-read quantity from state
    const qty = parseFloat(quantity);

    try {
      // Collect valid serial numbers from serialized item array
      const validSerials = isSerializedItem
        ? serialNumbers
          .filter((s) => s.trim().length > 0)
          .map(normalizeSerialValue)
        : [];

      // Prepare serial entries data with full details (for serialized items)
      const serialEntriesData = isSerializedItem
        ? serialEntries
          .filter((e) => e.serial_number.trim().length > 0)
          .map((e) => ({
            serial_number: normalizeSerialValue(e.serial_number),
            mrp: e.mrp,
            manufacturing_date: e.manufacturing_date,
            mfg_date_format: e.mfg_date_format,
            expiry_date: e.expiry_date,
            expiry_date_format: e.expiry_date_format,
          }))
        : [];

      // Determine manufacturing date - from item-level input or existing item data
      const mfgDate =
        hasMfgDate && itemMfgDate ? itemMfgDate : item.manufacturing_date;

      // Determine expiry date - from item-level input
      const expDate =
        hasExpiryDate && itemExpiryDate ? itemExpiryDate : item.expiry_date;

      const payload: CreateCountLinePayload = {
        session_id: sessionId,
        item_code: item.item_code || barcode,
        counted_qty: qty,
        floor_no: currentFloor || "Unknown",
        rack_no: currentRack || "Unknown",
        item_condition: condition,
        remark: remark,
        damage_included: isDamageEnabled,
        damaged_qty:
          isDamageEnabled && damageType === "returnable"
            ? parseFloat(damageQty)
            : 0,
        non_returnable_damaged_qty:
          isDamageEnabled && damageType === "nonreturnable"
            ? parseFloat(damageQty)
            : 0,
        // Serial numbers - use validated array (backward compatibility)
        serial_numbers: validSerials,
        // Enhanced serial entries with per-item details
        serial_entries:
          serialEntriesData.length > 0 ? serialEntriesData : undefined,
        variance_note: varianceRemark,
        variance_reason: varianceRemark,
        mrp_counted: parseFloat(mrp) || item.mrp || 0,
        manufacturing_date: mfgDate,
        mfg_date_format: hasMfgDate ? itemMfgDateFormat : undefined,
        expiry_date: expDate,
        expiry_date_format: hasExpiryDate ? itemExpiryDateFormat : undefined,
        photo_proofs: [
          ...(damagePhoto
            ? [
              {
                type: "DAMAGE" as any,
                uri: damagePhoto,
                capturedAt: new Date().toISOString(),
                base64: "", // Would need base64 if uploading directly
              },
            ]
            : []),
          ...itemPhotos.map((uri) => ({
            type: "ITEM" as any,
            uri: uri,
            capturedAt: new Date().toISOString(),
            base64: "",
          })),
        ],
      };

      const result = await createCountLine(payload);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (result.is_misplaced) {
        Alert.alert(
          "Misplaced Item",
          "This item is not expected at this location. It has been flagged for review.",
          [{ text: "OK", onPress: () => handleBackPress() }],
        );
      } else {
        toastService.show("Item verified successfully", { type: "success" });
        handleBackPress();
      }

    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert(
          "Duplicate Scan",
          "This item has already been scanned at this location in this session.",
        );
      } else if (error.response?.status === 423) {
        toastService.show(
          "Item is being processed by another user. Please try again.",
          { type: "warning" },
        );
      } else {
        Alert.alert("Error", error.message || "Failed to save count");
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    barcode,
    condition,
    currentFloor,
    currentRack,
    damageQty,
    damageType,
    hasExpiryDate,
    hasMfgDate,
    isDamageEnabled,
    isSerializedItem,
    item,
    itemExpiryDate,
    itemExpiryDateFormat,
    itemMfgDate,
    itemMfgDateFormat,
    mrp,
    quantity,
    remark,
    handleBackPress,
    serialEntries,
    serialNumbers,
    sessionId,
    varianceRemark,
    damagePhoto,
    itemPhotos,
  ]);

  // Handle countdown effect
  useEffect(() => {
    if (submitCountdown === null) return;

    if (submitCountdown > 0) {
      submitTimerRef.current = setTimeout(() => {
        setSubmitCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else {
      // Countdown finished, trigger actual submit
      executeSubmit();
    }

    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, [executeSubmit, submitCountdown]);

  const cancelSubmit = () => {
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    setSubmitCountdown(null);
  };

  if (loading) {
    return (
      <ThemedScreen>
        <ModernHeader
          title="Verify Item"
          showBackButton
          onBackPress={handleBackPress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={{ marginTop: 12, color: semanticColors.text.secondary }}>
            Loading item details...
          </Text>
        </View>
      </ThemedScreen>
    );
  }

  if (!item) {
    return (
      <ThemedScreen>
        <ModernHeader
          title="Verify Item"
          showBackButton
          onBackPress={handleBackPress}
        />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colors.error[500]}
          />
          <Text style={styles.errorTitle}>Item Not Found</Text>
          <Text style={styles.errorText}>
            We couldn't retrieve details for the scanned barcode.
          </Text>
          <ModernButton
            title="Try Again"
            onPress={handleBackPress}
            style={{ marginTop: 24, width: "100%" }}
          />
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
      <ModernHeader
        title="Verify Item"
        showBackButton
        onBackPress={handleBackPress}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Misplaced Item Warning Badge */}
          {item.is_misplaced && (
            <View style={styles.misplacedBadge}>
              <Ionicons name="alert-circle" size={24} color={colors.white} />
              <View style={styles.misplacedContent}>
                <Text style={styles.misplacedTitle}>MISPLACED ITEM</Text>
                <Text style={styles.misplacedText}>
                  This item belongs in{" "}
                  <Text style={styles.misplacedHighlight}>
                    {item.expected_location || "another location"}
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Item Header Card */}
          <View>
            <ModernCard style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.iconContainer}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={{ width: "100%", height: "100%", borderRadius: 8 }}
                      contentFit="cover"
                      transition={300}
                    />
                  ) : (
                    <Ionicons
                      name="cube-outline"
                      size={24}
                      color={colors.primary[600]}
                    />
                  )}
                </View>

                <View style={styles.itemInfo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                    }}
                  >
                    <Text
                      style={[
                        styles.itemName,
                        { color: semanticColors.text.primary, flex: 1 },
                      ]}
                      numberOfLines={2}
                    >
                      {item.item_name || item.name}
                    </Text>

                    {item._source && (
                      <View
                        style={[
                          styles.sourceBadge,
                          item._source === "sql"
                            ? {
                              backgroundColor: colors.primary[50],
                              borderColor: colors.primary[200],
                            }
                            : item._source === "cache"
                              ? {
                                backgroundColor: colors.warning[50],
                                borderColor: colors.warning[200],
                              }
                              : {
                                backgroundColor: colors.success[50],
                                borderColor: colors.success[200],
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.sourceBadgeText,
                            item._source === "sql"
                              ? { color: colors.primary[700] }
                              : item._source === "cache"
                                ? { color: colors.warning[700] }
                                : { color: colors.success[700] },
                          ]}
                        >
                          {item._source === "sql"
                            ? "SQL"
                            : item._source === "cache"
                              ? "Cache"
                              : "MongoDB"}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.itemCode,
                      { color: semanticColors.text.secondary },
                    ]}
                  >
                    {item.category || "-"} • {item.subcategory || "-"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: semanticColors.text.secondary },
                      ]}
                    >
                      Stock
                    </Text>
                    <TouchableOpacity
                      onPress={handleRefreshStock}
                      disabled={isRefreshing}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={isRefreshing ? "hourglass-outline" : "refresh"}
                        size={14}
                        color={colors.primary[600]}
                        style={{ opacity: isRefreshing ? 0.5 : 1 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: semanticColors.text.primary },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {settings.showItemStock
                      ? (() => {
                        const qty = item.current_stock ?? item.stock_qty ?? 0;
                        const uom = item.uom_name || item.uom_code || "";
                        return uom ? `${qty} ${uom}` : String(qty);
                      })()
                      : "---"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: semanticColors.text.secondary },
                    ]}
                  >
                    MRP
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: semanticColors.text.primary },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {settings.showItemPrices ? `₹${item.mrp || 0}` : "---"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: semanticColors.text.secondary },
                    ]}
                  >
                    Price
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: semanticColors.text.primary },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {settings.showItemPrices
                      ? `₹${item.sale_price || item.sales_price || 0}`
                      : "---"}
                  </Text>
                </View>
              </View>
            </ModernCard>
          </View>

          {isInteractionsComplete && (
            <>
              {/* Quantity Input - PRIMARY SECTION */}
              <View style={styles.section}>
                {/* Barcode Display */}
                <View
                  style={{ alignItems: "center", marginBottom: spacing.md }}
                >
                  <Text
                    style={{
                      fontSize: fontSize.sm,
                      color: semanticColors.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    Barcode
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize.xl,
                      fontWeight: fontWeight.bold,
                      color: semanticColors.text.primary,
                      letterSpacing: 1,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                  >
                    {item.barcode || barcode || "N/A"}
                  </Text>
                </View>

                {item?.is_bundle && item?.components && (
                  <View style={styles.bundleSection}>
                    <Text
                      style={[
                        styles.bundleTitle,
                        { color: semanticColors.text.primary },
                      ]}
                    >
                      Bundle Components
                    </Text>
                    {item.components.map((comp: any, idx: number) => (
                      <View key={idx} style={styles.bundleItem}>
                        <Ionicons
                          name="cube-outline"
                          size={18}
                          color={colors.primary[600]}
                        />
                        <Text
                          style={[
                            styles.bundleItemName,
                            { color: semanticColors.text.primary },
                          ]}
                        >
                          {comp.item_name || comp.item_code}
                        </Text>
                        <Text
                          style={[
                            styles.bundleItemQty,
                            { color: colors.primary[700] },
                          ]}
                        >
                          x{comp.qty_per_bundle}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {item?._source === "cache" && (
                  <View style={styles.staleWarning}>
                    <Ionicons
                      name="warning"
                      size={18}
                      color={colors.warning[700]}
                    />
                    <View style={styles.staleWarningContent}>
                      <Text style={styles.staleWarningTitle}>ERP Offline</Text>
                      <Text style={styles.staleWarningText}>
                        Variance is based on a cached stock snapshot.
                      </Text>
                    </View>
                  </View>
                )}

                <View style={[styles.sectionHeader, { alignItems: 'center' }]}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: semanticColors.text.primary, marginBottom: 2 },
                      ]}
                    >
                      Count
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{
                        backgroundColor: colors.primary[50],
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: colors.primary[100]
                      }}>
                        <Text style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: colors.primary[700],
                          textTransform: 'uppercase'
                        }}>
                          {uomInfo.label} Mode
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.sectionMeta,
                          { color: semanticColors.text.secondary, fontSize: 12 },
                        ]}
                      >
                        Unit: {uomInfo.unit}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setIsSplitMode(!isSplitMode);
                      if (!isSplitMode && splitCounts.length === 0) {
                        setSplitCounts([quantity !== "0" ? quantity : ""]);
                      }
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: isSplitMode ? colors.primary[600] : colors.neutral[100],
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}
                  >
                    <Ionicons
                      name={isSplitMode ? "grid" : "grid-outline"}
                      size={14}
                      color={isSplitMode ? colors.white : colors.primary[600]}
                    />
                    <Text style={{
                      color: isSplitMode ? colors.white : colors.primary[600],
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {isSplitMode ? "Piece Count" : "Split Count"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.qtyButton,
                      { backgroundColor: isSplitMode ? colors.neutral[100] : colors.neutral[200] },
                    ]}
                    onPress={() => {
                      if (isSplitMode) return;
                      const val = parseFloat(quantity) || 0;
                      const step = getQuantityStep();
                      if (val > step) {
                        const newVal = val - step;
                        setQuantity(formatQuantity(String(newVal)));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } else if (val > 0) {
                        setQuantity("0");
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    disabled={isSplitMode}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="remove"
                      size={28}
                      color={isSplitMode ? colors.neutral[300] : semanticColors.text.primary}
                    />
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.qtyDisplay,
                      {
                        backgroundColor: semanticColors.background.paper,
                        borderColor: colors.primary[200],
                      },
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.qtyText,
                        { color: isSplitMode ? colors.primary[700] : semanticColors.text.primary },
                      ]}
                      value={quantity}
                      onChangeText={handleQuantityChange}
                      editable={!isSplitMode}
                      onBlur={() => {
                        if (quantity && quantity !== "." && quantity !== "0.") {
                          setQuantity(formatQuantity(quantity));
                        } else {
                          setQuantity("0");
                        }
                      }}
                      keyboardType={
                        isWeightBasedUOM ? "decimal-pad" : "number-pad"
                      }
                      selectTextOnFocus
                      placeholder="0"
                      placeholderTextColor={semanticColors.text.disabled}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.qtyButton,
                      { backgroundColor: isSplitMode ? colors.neutral[100] : colors.primary[600] },
                    ]}
                    onPress={() => {
                      if (isSplitMode) return;
                      const val = parseFloat(quantity) || 0;
                      const step = getQuantityStep();
                      const newVal = val + step;
                      setQuantity(formatQuantity(String(newVal)));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    disabled={isSplitMode}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={28} color={isSplitMode ? colors.neutral[300] : colors.white} />
                  </TouchableOpacity>
                </View>

                {isSplitMode && (
                  <View style={styles.splitCountContainer}>
                    <Text style={{
                      fontSize: 12,
                      color: semanticColors.text.secondary,
                      marginBottom: spacing.sm,
                      fontWeight: '500'
                    }}>
                      Enter individual pieces below. They will be summed automatically.
                    </Text>
                    {splitCounts.map((val, idx) => (
                      <View key={idx} style={styles.splitRow}>
                        <View style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: colors.neutral[100],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.neutral[600] }}>
                            #{idx + 1}
                          </Text>
                        </View>
                        <TextInput
                          style={styles.splitInput}
                          value={val}
                          onChangeText={(newVal) => {
                            const regex = uomInfo.precision > 0
                              ? new RegExp(`^\\d*\\.?\\d{0,${uomInfo.precision}}$`)
                              : /^\d*$/;

                            if (newVal === "" || newVal === "." || regex.test(newVal)) {
                              const updated = [...splitCounts];
                              updated[idx] = newVal;
                              setSplitCounts(updated);
                            }
                          }}
                          onBlur={() => {
                            const updated = [...splitCounts];
                            if (val === "" || val === ".") {
                              updated[idx] = "0";
                            } else {
                              updated[idx] = formatQuantity(val);
                            }
                            setSplitCounts(updated);
                          }}
                          keyboardType={uomInfo.precision > 0 ? "decimal-pad" : "number-pad"}
                          placeholder="0"
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setSplitCounts(splitCounts.filter((_, i) => i !== idx));
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }}
                          style={{ padding: 8 }}
                        >
                          <Ionicons name="remove-circle" size={24} color={colors.error[400]} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                      <TouchableOpacity
                        style={[styles.addSplitButton, { flex: 1, height: 44 }]}
                        onPress={() => {
                          setSplitCounts([...splitCounts, ""]);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Ionicons name="add-circle" size={20} color={colors.white} />
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>Add Piece</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: borderRadius.md,
                          backgroundColor: colors.neutral[100],
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: colors.neutral[200]
                        }}
                        onPress={() => {
                          Alert.alert(
                            "Clear Split Counts?",
                            "This will reset all individual pieces.",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Clear",
                                style: "destructive",
                                onPress: () => {
                                  setSplitCounts([]);
                                  setIsSplitMode(false);
                                  setQuantity("0");
                                }
                              }
                            ]
                          );
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Batches */}
              {(sameNameVariants.length > 0 || rawVariants.length > 0) && (
                <View style={styles.section}>
                  <View style={styles.batchHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: semanticColors.text.primary, marginBottom: 0 },
                      ]}
                    >
                      Batches
                    </Text>
                    {batchLoading && (
                      <ActivityIndicator
                        size="small"
                        color={colors.primary[600]}
                      />
                    )}
                    <View style={styles.batchToggle}>
                      <Text
                        style={[
                          styles.batchToggleLabel,
                          { color: semanticColors.text.secondary },
                        ]}
                      >
                        Include 0 stock
                      </Text>
                      <Switch
                        value={showZeroStock}
                        onValueChange={setShowZeroStock}
                        trackColor={{
                          true: colors.primary[600],
                          false: colors.neutral[200],
                        }}
                        thumbColor={colors.white}
                        style={styles.batchToggleSwitch}
                      />
                    </View>
                  </View>

                  {sameNameVariants.length === 0 ? (
                    <Text
                      style={[
                        styles.batchEmpty,
                        {
                          color: batchError
                            ? colors.warning[700]
                            : semanticColors.text.secondary,
                        },
                      ]}
                    >
                      {batchError ||
                        (showZeroStock
                          ? "No other batches."
                          : "No batches with stock.")}
                    </Text>
                  ) : (
                    <View style={styles.batchList}>
                      {sameNameVariants.map((variant, index) => {
                        const stockQty =
                          variant.stock_qty ?? variant.current_stock ?? 0;
                        const batchTitle =
                          variant.batch_no || variant.item_code || "N/A";
                        const showDates = Boolean(
                          variant.expiry_date || variant.manufacturing_date,
                        );
                        const variantKey =
                          variant._id ??
                          [
                            variant.item_code,
                            variant.barcode,
                            variant.batch_no,
                            `idx-${index}`,
                          ]
                            .filter(
                              (value) =>
                                value !== undefined &&
                                value !== null &&
                                value !== "",
                            )
                            .join(":");

                        return (
                          <TouchableOpacity
                            key={variantKey}
                            onPress={() => {
                              // Switch to this item/batch
                              setLoading(true);
                              router.replace({
                                pathname: "/staff/item-detail",
                                params: { barcode: variant.barcode, sessionId },
                              });
                            }}
                            activeOpacity={0.7}
                          >
                            <ModernCard style={styles.batchCard}>
                              <View style={styles.batchRow}>
                                <View style={styles.batchInfo}>
                                  <Text
                                    style={[
                                      styles.batchTitle,
                                      { color: semanticColors.text.primary },
                                    ]}
                                  >
                                    Batch {batchTitle}
                                  </Text>
                                  {variant.batch_no && variant.item_code && (
                                    <Text
                                      style={[
                                        styles.batchSub,
                                        {
                                          color: semanticColors.text.secondary,
                                        },
                                      ]}
                                    >
                                      {variant.item_code}
                                    </Text>
                                  )}
                                  {showDates && (
                                    <Text
                                      style={[
                                        styles.batchMeta,
                                        {
                                          color: semanticColors.text.secondary,
                                        },
                                      ]}
                                    >
                                      Exp:{" "}
                                      {formatBatchDate(variant.expiry_date)}{" "}
                                      Mfg:{" "}
                                      {formatBatchDate(
                                        variant.manufacturing_date,
                                      )}
                                    </Text>
                                  )}
                                </View>
                                <View style={styles.batchStock}>
                                  <Text
                                    style={[
                                      styles.batchStockValue,
                                      { color: semanticColors.text.primary },
                                    ]}
                                  >
                                    {stockQty}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.batchStockLabel,
                                      { color: semanticColors.text.secondary },
                                    ]}
                                  >
                                    Stock
                                  </Text>
                                </View>
                              </View>
                            </ModernCard>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* Manufacturing & Expiry Date Section */}
              {(settings.columnVisibility.mfgDate ||
                settings.columnVisibility.expiryDate) && (
                  <View style={styles.section}>
                    {/* Mfg Date Toggle */}
                    {settings.columnVisibility.mfgDate && (
                      <View style={styles.toggleRow}>
                        <View style={styles.toggleLabelContainer}>
                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={colors.primary[600]}
                          />
                          <Text
                            style={[
                              styles.toggleLabel,
                              { color: semanticColors.text.primary },
                            ]}
                          >
                            Has Manufacturing Date
                          </Text>
                        </View>
                        <Switch
                          value={hasMfgDate}
                          onValueChange={(val) => {
                            setHasMfgDate(val);
                            if (!val) setItemMfgDate("");
                          }}
                          trackColor={{
                            false: colors.neutral[200],
                            true: colors.primary[600],
                          }}
                          thumbColor={
                            hasMfgDate ? colors.white : colors.neutral[50]
                          }
                        />
                      </View>
                    )}

                    {/* Manufacturing Date Input */}
                    {settings.columnVisibility.mfgDate && hasMfgDate && (
                      <View style={styles.itemDateSection}>
                        <View style={styles.dateLabelRow}>
                          <Text style={styles.itemDateLabel}>
                            Manufacturing Date
                          </Text>
                          <View style={styles.dateFormatPicker}>
                            {DATE_FORMAT_OPTIONS.map((opt) => (
                              <TouchableOpacity
                                key={opt.value}
                                style={[
                                  styles.dateFormatOption,
                                  itemMfgDateFormat === opt.value &&
                                  styles.dateFormatOptionActive,
                                ]}
                                onPress={() => {
                                  setItemMfgDateFormat(opt.value);
                                  setItemMfgDate("");
                                }}
                              >
                                <Text
                                  style={[
                                    styles.dateFormatOptionText,
                                    itemMfgDateFormat === opt.value &&
                                    styles.dateFormatOptionTextActive,
                                  ]}
                                >
                                  {opt.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                        <View
                          style={[
                            styles.itemDateInput,
                            {
                              borderColor:
                                itemMfgDate &&
                                  !validateDateInput(itemMfgDate, itemMfgDateFormat)
                                  ? colors.error[500]
                                  : colors.neutral[300],
                              backgroundColor: semanticColors.background.paper,
                            },
                          ]}
                        >
                          {isMfgFull ? (
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("day")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !mfgDay && styles.placeholderText,
                                  ]}
                                >
                                  {mfgDay || "DD"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("month")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !mfgMonth && styles.placeholderText,
                                  ]}
                                >
                                  {mfgMonth || "MM"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("year")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !mfgYear && styles.placeholderText,
                                  ]}
                                >
                                  {mfgYear || "YYYY"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : isMfgMonthYear ? (
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("month")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !mfgMonth && styles.placeholderText,
                                  ]}
                                >
                                  {mfgMonth || "MM"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("year")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !mfgYear && styles.placeholderText,
                                  ]}
                                >
                                  {mfgYear || "YYYY"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.smallPickerFull}
                              onPress={() => openSelect("year")}
                            >
                              <Text
                                style={[
                                  styles.smallPickerText,
                                  !mfgYear && styles.placeholderText,
                                ]}
                              >
                                {mfgYear || "YYYY"}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Exp Date Toggle */}
                    {settings.columnVisibility.expiryDate && (
                      <View style={[styles.toggleRow, { marginTop: spacing.md }]}>
                        <View style={styles.toggleLabelContainer}>
                          <Ionicons
                            name="time-outline"
                            size={20}
                            color={colors.warning[600]}
                          />
                          <Text
                            style={[
                              styles.toggleLabel,
                              { color: semanticColors.text.primary },
                            ]}
                          >
                            Has Expiry Date
                          </Text>
                        </View>
                        <Switch
                          value={hasExpiryDate}
                          onValueChange={(val) => {
                            setHasExpiryDate(val);
                            if (!val) setItemExpiryDate("");
                          }}
                          trackColor={{
                            false: colors.neutral[200],
                            true: colors.warning[600],
                          }}
                          thumbColor={
                            hasExpiryDate ? colors.white : colors.neutral[50]
                          }
                        />
                      </View>
                    )}

                    {/* Expiry Date Input */}
                    {settings.columnVisibility.expiryDate && hasExpiryDate && (
                      <View style={styles.itemDateSection}>
                        <View style={styles.dateLabelRow}>
                          <Text style={styles.itemDateLabel}>Expiry Date</Text>
                          <View style={styles.dateFormatPicker}>
                            {DATE_FORMAT_OPTIONS.map((opt) => (
                              <TouchableOpacity
                                key={opt.value}
                                style={[
                                  styles.dateFormatOption,
                                  itemExpiryDateFormat === opt.value &&
                                  styles.dateFormatOptionActive,
                                ]}
                                onPress={() => {
                                  setItemExpiryDateFormat(opt.value);
                                  setItemExpiryDate("");
                                }}
                              >
                                <Text
                                  style={[
                                    styles.dateFormatOptionText,
                                    itemExpiryDateFormat === opt.value &&
                                    styles.dateFormatOptionTextActive,
                                  ]}
                                >
                                  {opt.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                        <View
                          style={[
                            styles.itemDateInput,
                            {
                              borderColor:
                                itemExpiryDate &&
                                  !validateDateInput(
                                    itemExpiryDate,
                                    itemExpiryDateFormat,
                                  )
                                  ? colors.error[500]
                                  : colors.neutral[300],
                              backgroundColor: semanticColors.background.paper,
                            },
                          ]}
                        >
                          {isExpiryFull ? (
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("day", "exp")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !expiryDay && styles.placeholderText,
                                  ]}
                                >
                                  {expiryDay || "DD"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("month", "exp")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !expiryMonth && styles.placeholderText,
                                  ]}
                                >
                                  {expiryMonth || "MM"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("year", "exp")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !expiryYear && styles.placeholderText,
                                  ]}
                                >
                                  {expiryYear || "YYYY"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : isExpiryMonthYear ? (
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("month", "exp")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !expiryMonth && styles.placeholderText,
                                  ]}
                                >
                                  {expiryMonth || "MM"}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallPicker}
                                onPress={() => openSelect("year", "exp")}
                              >
                                <Text
                                  style={[
                                    styles.smallPickerText,
                                    !expiryYear && styles.placeholderText,
                                  ]}
                                >
                                  {expiryYear || "YYYY"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.smallPickerFull}
                              onPress={() => openSelect("year", "exp")}
                            >
                              <Text
                                style={[
                                  styles.smallPickerText,
                                  !expiryYear && styles.placeholderText,
                                ]}
                              >
                                {expiryYear || "YYYY"}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                )}

              {/* Is Serialized Toggle */}
              {settings.columnVisibility.serialNumber && (
                <View style={styles.section}>
                  <View style={styles.toggleRow}>
                    <View style={styles.toggleLabelContainer}>
                      <Ionicons
                        name="barcode-outline"
                        size={20}
                        color={colors.primary[600]}
                      />
                      <Text
                        style={[
                          styles.toggleLabel,
                          { color: semanticColors.text.primary },
                        ]}
                      >
                        Is Serialized Item
                      </Text>
                    </View>
                    <Switch
                      value={isSerializedItem}
                      onValueChange={setIsSerializedItem}
                      trackColor={{
                        false: colors.neutral[200],
                        true: colors.primary[600],
                      }}
                      thumbColor={
                        isSerializedItem ? colors.white : colors.neutral[50]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.toggleHint,
                      { color: semanticColors.text.secondary },
                    ]}
                  >
                    {isSerializedItem
                      ? "Enable to capture individual serial numbers for each unit"
                      : "Turn on if this item has unique serial numbers"}
                  </Text>
                </View>
              )}

              {/* Serial Number Input - Only visible when Is Serialized is enabled */}
              {settings.columnVisibility.serialNumber && isSerializedItem && (
                <View style={styles.section}>
                  <View style={styles.serialHeader}>
                    <View style={styles.serialTitleRow}>
                      <Ionicons
                        name="barcode-outline"
                        size={20}
                        color={colors.primary[600]}
                      />
                      <Text
                        style={[
                          styles.sectionTitle,
                          {
                            color: semanticColors.text.primary,
                            marginLeft: spacing.xs,
                          },
                        ]}
                      >
                        Serial Numbers
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.serialHelperText,
                        { color: semanticColors.text.secondary },
                      ]}
                    >
                      Scan or type serial numbers - quantity auto-updates (
                      {serialEntries.length} scanned)
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.scanSerialButton}
                    onPress={() => setShowSerialScanner(true)}
                  >
                    <Ionicons name="scan" size={24} color={colors.white} />
                    <Text style={styles.scanSerialButtonText}>
                      Scan Serial Numbers
                    </Text>
                  </TouchableOpacity>

                  {serialValidationErrors.length > 0 && (
                    <View style={styles.validationErrorContainer}>
                      {serialValidationErrors.map((error, idx) => (
                        <Text key={idx} style={styles.validationErrorText}>
                          • {error}
                        </Text>
                      ))}
                    </View>
                  )}

                  {serialEntries.map((entry, index) => (
                    <View key={entry.id} style={styles.serialEntryCard}>
                      <View style={styles.serialEntryHeader}>
                        <Text
                          style={[
                            styles.serialLabel,
                            { color: semanticColors.text.secondary },
                          ]}
                        >
                          Unit #{index + 1}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeSerialButton}
                          onPress={() => handleRemoveSerial(index)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color={colors.error[500]}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.serialInputContainer}>
                        <TextInput
                          style={[
                            styles.serialTextInput,
                            {
                              color: semanticColors.text.primary,
                              backgroundColor: semanticColors.background.paper,
                              borderColor: entry.serial_number.trim()
                                ? validateSerialNumber(entry.serial_number)
                                  ? colors.error[500]
                                  : colors.success[500]
                                : colors.neutral[300],
                            },
                          ]}
                          value={entry.serial_number}
                          onChangeText={(text) =>
                            handleSerialChange(index, "serial_number", text)
                          }
                          placeholder="Serial number"
                          placeholderTextColor={semanticColors.text.disabled}
                          autoCapitalize="characters"
                          autoCorrect={false}
                        />
                      </View>
                      {entry.serial_number.trim() &&
                        validateSerialNumber(entry.serial_number) && (
                          <Text style={styles.serialErrorText}>
                            {validateSerialNumber(entry.serial_number)}
                          </Text>
                        )}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addSerialButton}
                    onPress={handleAddSerial}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary[600]}
                    />
                    <Text style={styles.addSerialButtonText}>
                      Add Serial Manually
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* MRP Selection / Override */}
              {settings.columnVisibility.mrp && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: semanticColors.text.primary },
                      ]}
                    >
                      MRP
                    </Text>
                    {/* Always allow manual edit switch */}
                    <Switch
                      value={mrpEditable}
                      onValueChange={setMrpEditable}
                      trackColor={{
                        false: colors.neutral[200],
                        true: colors.primary[600],
                      }}
                    />
                  </View>

                  {mrpVariants.length > 0 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.chipsScroll}
                    >
                      {mrpVariants.map((variant, index) => {
                        const variantKey =
                          variant?.id || variant?.value || index;
                        return (
                          <TouchableOpacity
                            key={`mrp-${variantKey}-${index}`}
                            style={[
                              styles.chip,
                              {
                                backgroundColor:
                                  semanticColors.background.paper,
                                borderColor: semanticColors.border.default,
                              },
                              selectedMrpVariant?.value === variant.value && {
                                backgroundColor: colors.primary[50],
                                borderColor: colors.primary[600],
                              },
                            ]}
                            onPress={() => {
                              setSelectedMrpVariant(variant);
                              setMrp(String(variant.value));
                            }}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                { color: semanticColors.text.secondary },
                                selectedMrpVariant?.value === variant.value && {
                                  color: colors.primary[700],
                                  fontWeight: fontWeight.medium,
                                },
                              ]}
                            >
                              ₹{variant.value}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : mrpEditable ? (
                    <ModernInput
                      value={mrp}
                      onChangeText={setMrp}
                      keyboardType="numeric"
                      placeholder="Enter new MRP"
                      icon="pricetag"
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: semanticColors.text.primary,
                      }}
                    >
                      ₹{mrp || item.mrp || 0}
                    </Text>
                  )}
                </View>
              )}

              {/* Is Damaged Section */}
              <View style={styles.section}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={colors.error[600]}
                    />
                    <Text
                      style={[
                        styles.toggleLabel,
                        { color: semanticColors.text.primary },
                      ]}
                    >
                      Is Damaged Item
                    </Text>
                  </View>
                  <Switch
                    value={isDamageEnabled}
                    onValueChange={setIsDamageEnabled}
                    trackColor={{
                      false: colors.neutral[200],
                      true: colors.error[500],
                    }}
                    thumbColor={
                      isDamageEnabled ? colors.white : colors.neutral[50]
                    }
                  />
                </View>

                {isDamageEnabled && (
                  <View style={styles.damageContainer}>
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color: colors.error[700],
                          fontWeight: fontWeight.bold,
                        },
                      ]}
                    >
                      Select Damage Type
                    </Text>
                    <View style={styles.damageTypeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.damageTypeButton,
                          damageType === "returnable" &&
                          styles.damageTypeSelected,
                        ]}
                        onPress={() => setDamageType("returnable")}
                      >
                        <Text
                          style={[
                            styles.damageTypeText,
                            damageType === "returnable" &&
                            styles.damageTypeTextSelected,
                          ]}
                        >
                          Returnable
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.damageTypeButton,
                          damageType === "nonreturnable" &&
                          styles.damageTypeSelected,
                        ]}
                        onPress={() => setDamageType("nonreturnable")}
                      >
                        <Text
                          style={[
                            styles.damageTypeText,
                            damageType === "nonreturnable" &&
                            styles.damageTypeTextSelected,
                          ]}
                        >
                          Non-Returnable
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: spacing.md }}>
                      <Text
                        style={[
                          styles.detailLabel,
                          { color: colors.error[700] },
                        ]}
                      >
                        Damage Quantity
                      </Text>
                      <TextInput
                        style={[
                          styles.qtyText,
                          {
                            fontSize: 24,
                            height: 50,
                            borderWidth: 1,
                            borderColor: colors.error[200],
                            borderRadius: 8,
                            marginTop: 4,
                          },
                        ]}
                        value={damageQty}
                        onChangeText={setDamageQty}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>

                    <View style={styles.photoContainer}>
                      <TouchableOpacity
                        style={[
                          styles.photoButton,
                          damagePhoto && styles.photoButtonSuccess,
                        ]}
                        onPress={handleTakePhoto}
                      >
                        <Ionicons
                          name={damagePhoto ? "checkmark-circle" : "camera"}
                          size={24}
                          color={damagePhoto ? colors.white : colors.error[600]}
                        />
                        <Text
                          style={[
                            styles.photoButtonText,
                            damagePhoto && { color: colors.white },
                          ]}
                        >
                          {damagePhoto ? "Update Photo" : "Capture Photo"}
                        </Text>
                      </TouchableOpacity>

                      {damagePhoto && (
                        <View style={styles.photoPreviewWrapper}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={colors.success[600]}
                          />
                          <Text style={styles.photoPreviewText}>
                            Photo captured
                          </Text>
                          <TouchableOpacity
                            onPress={() => setDamagePhoto(null)}
                          >
                            <Text style={styles.photoRemoveText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* Optional Item Photos Section */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: semanticColors.text.primary },
                  ]}
                >
                  Item Photos (Optional)
                </Text>

                <View style={styles.itemPhotosRow}>
                  {itemPhotos.map((uri, idx) => (
                    <View key={idx} style={styles.itemPhotoWrapper}>
                      <ModernCard style={styles.itemPhotoCard}>
                        <Ionicons
                          name="image"
                          size={32}
                          color={colors.primary[200]}
                        />
                        <TouchableOpacity
                          style={styles.removePhotoBadge}
                          onPress={() =>
                            setItemPhotos((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={colors.error[600]}
                          />
                        </TouchableOpacity>
                      </ModernCard>
                    </View>
                  ))}

                  {itemPhotos.length < 3 && (
                    <TouchableOpacity
                      style={styles.addPhotoCard}
                      onPress={handleCaptureItemPhoto}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={32}
                        color={colors.primary[600]}
                      />
                      <Text style={styles.addPhotoSubtext}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Variance Remark */}
              <View style={styles.section}>
                <ModernInput
                  value={varianceRemark}
                  onChangeText={setVarianceRemark}
                  placeholder="Variance reason (if any)"
                  label="Variance Remark"
                />
              </View>

              <View style={styles.section}>
                <ModernInput
                  value={remark}
                  onChangeText={setRemark}
                  placeholder="Add remarks (optional)"
                  label="Remarks"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </>
          )}

          <View style={styles.footerSpacer} />
        </ScrollView>

        <View
          style={[
            styles.bottomContainer,
            {
              backgroundColor: semanticColors.background.paper,
              borderTopColor: semanticColors.border.default,
            },
          ]}
        >
          <ModernButton
            title={
              submitCountdown !== null
                ? `Undo (${submitCountdown}s)`
                : "Save & Verify"
            }
            onPress={
              submitCountdown !== null ? cancelSubmit : handleSubmitPress
            }
            loading={submitting}
            variant={submitCountdown !== null ? "danger" : "primary"}
            icon={
              submitCountdown !== null ? "close-circle" : "checkmark-circle"
            }
            fullWidth
          />
        </View>
      </View>

      {/* Global Modals & Selection */}
      <Modal visible={selectVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectTitle}</Text>
            <FlatList
              data={selectOptions}
              keyExtractor={(i) => i}
              renderItem={({ item: opt }) => (
                <Pressable
                  onPress={() => onSelectOption(opt)}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{opt}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SerialScannerModal
        visible={showSerialScanner}
        existingSerials={serialEntries.map((e) => e.serial_number)}
        itemName={item?.item_name || item?.name}
        defaultMrp={parseFloat(mrp) || item?.mrp}
        onSerialScanned={handleSerialScanned}
        onClose={() => setShowSerialScanner(false)}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background handled by ThemedScreen
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.neutral[900],
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    textAlign: "center",
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  itemCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  itemHeader: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: 2,
  },
  sourceBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  sourceBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  itemCode: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    paddingTop: spacing.md,
    justifyContent: "space-between",
  },
  detailItem: {
    minWidth: "30%",
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.neutral[900],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  sectionMeta: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  batchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  batchToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  batchToggleLabel: {
    fontSize: fontSize.xs,
  },
  batchToggleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  batchEmpty: {
    fontStyle: "italic",
    textAlign: "center" as const,
    marginVertical: spacing.xs,
  },
  batchList: {
    gap: spacing.sm,
  },
  batchCard: {
    padding: spacing.sm,
  },
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  batchInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  batchTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  batchSub: {
    fontSize: fontSize.xs,
  },
  batchMeta: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  batchStock: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  batchStockValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  batchStockLabel: {
    fontSize: fontSize.xs,
  },
  qtyButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[400],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
    ...(Platform.OS === "web" && ({ cursor: "pointer" } as any)),
  },
  staleWarning: {
    flexDirection: "row",
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning[200],
    marginBottom: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  staleWarningContent: {
    flex: 1,
  },
  staleWarningTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.warning[800],
    marginBottom: 2,
  },
  staleWarningText: {
    fontSize: fontSize.xs,
    color: colors.warning[700],
    lineHeight: 16,
  },
  bundleSection: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[100],
    marginBottom: spacing.lg,
  },
  bundleTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  bundleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  bundleItemName: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  bundleItemQty: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  qtyDisplay: {
    minWidth: 100,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary[200],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    ...shadows.md,
  },
  qtyText: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: colors.neutral[900],
    textAlign: "center",
    minWidth: 60,
  },
  chipsScroll: {
    flexDirection: "row",
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    marginRight: spacing.sm,
    ...(Platform.OS === "web" && ({ cursor: "pointer" } as any)),
  },
  chipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[600],
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.neutral[700],
  },
  chipTextSelected: {
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  damageContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error[500],
  },
  damageTypeContainer: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  damageTypeButton: {
    flex: 1,
    padding: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error[500],
    marginRight: spacing.sm,
  },
  damageTypeSelected: {
    backgroundColor: colors.error[600],
    borderColor: colors.error[600],
  },
  damageTypeText: {
    fontSize: fontSize.sm,
    color: colors.error[600],
  },
  damageTypeTextSelected: {
    color: colors.white,
    fontWeight: fontWeight.medium,
  },
  photoContainer: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.error[200],
    paddingTop: spacing.md,
  },
  photoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.error[700],
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.error[500],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  photoButtonSuccess: {
    backgroundColor: colors.success[600],
    borderColor: colors.success[600],
  },
  photoButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.error[600],
  },
  photoPreviewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  photoPreviewText: {
    fontSize: fontSize.sm,
    color: colors.success[700],
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  photoRemoveText: {
    fontSize: fontSize.sm,
    color: colors.error[600],
    textDecorationLine: "underline",
  },
  itemPhotosRow: {
    flexDirection: "row",
    gap: spacing.md,
    flexWrap: "wrap",
    marginTop: spacing.sm,
  },
  itemPhotoWrapper: {
    position: "relative",
  },
  itemPhotoCard: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50],
    padding: 0,
    overflow: "hidden",
  },
  removePhotoBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 10,
    zIndex: 1,
  },
  addPhotoCard: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary[200],
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  addPhotoSubtext: {
    fontSize: 10,
    color: colors.primary[600],
    fontWeight: "bold",
    marginTop: 2,
  },
  footerSpacer: {
    height: 80,
  },
  bottomContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  // Skeleton Styles
  skeleton: {
    backgroundColor: colors.neutral[200],
    overflow: "hidden",
  },
  // Serial Number Styles for Serialized Items
  serialHeader: {
    marginBottom: spacing.md,
  },
  serialTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  requiredBadge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.error[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  requiredBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.error[600],
  },
  serialHelperText: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  validationErrorContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  validationErrorText: {
    fontSize: fontSize.sm,
    color: colors.error[600],
    marginBottom: 2,
  },
  serialInputRow: {
    marginBottom: spacing.sm,
  },
  serialInputWrapper: {
    flex: 1,
  },
  serialLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
    color: colors.neutral[600],
  },
  serialInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serialTextInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    borderColor: colors.neutral[300],
  },
  removeSerialButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  serialErrorText: {
    fontSize: fontSize.xs,
    color: colors.error[500],
    marginTop: 4,
  },
  addSerialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[300],
    borderRadius: borderRadius.md,
    borderStyle: "dashed",
  },
  addSerialButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary[600],
  },
  // Enhanced Serial Styles - Per-serial MRP/Mfg Date
  scanSerialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[600],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  scanSerialButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
  serialEntryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },
  serialEntryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  serialDetailsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  serialDetailField: {
    flex: 1,
  },
  serialDetailLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.neutral[500],
    marginBottom: 4,
  },
  serialDetailInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.sm,
    borderColor: colors.neutral[300],
  },
  // Toggle Switch Styles
  toggleRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: spacing.sm,
  },
  toggleLabelContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.sm,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  toggleHint: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  // Date Section Styles for Manufacturing and Expiry Dates
  dateSection: {
    marginTop: spacing.md,
  },
  dateLabelRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: spacing.xs,
    flexWrap: "wrap" as const,
  },
  dateFormatPicker: {
    flexDirection: "row" as const,
    gap: 4,
  },
  dateFormatOption: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  dateFormatOptionActive: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[500],
  },
  dateFormatOptionText: {
    fontSize: fontSize.xs - 1,
    color: colors.neutral[600],
    fontWeight: fontWeight.regular,
  },
  dateFormatOptionTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  // Item-level Date Section (for non-serialized items)
  itemDateSection: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  itemDateLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  itemDateInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.md,
    borderColor: colors.neutral[300],
    backgroundColor: colors.white,
  },
  smallPicker: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  smallPickerFull: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  smallPickerText: {
    fontSize: fontSize.md,
    color: colors.neutral[900],
  },
  placeholderText: {
    color: colors.neutral[400],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "60%",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  modalTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    marginBottom: spacing.sm,
  },
  modalOption: {
    paddingVertical: spacing.sm,
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.neutral[900],
  },
  modalClose: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  modalCloseText: {
    color: colors.primary[600],
    fontWeight: fontWeight.bold,
  },
  // Split Count Styles
  splitCountContainer: {
    marginTop: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  splitInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    color: colors.neutral[900],
  },
  addSplitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[600],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  misplacedBadge: {
    backgroundColor: colors.error[500],
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  misplacedContent: {
    flex: 1,
  },
  misplacedTitle: {
    color: colors.white,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  misplacedText: {
    color: colors.white,
    fontSize: fontSize.xs,
  },
  misplacedHighlight: {
    fontWeight: fontWeight.bold,
    textDecorationLine: "underline",
  },
});
