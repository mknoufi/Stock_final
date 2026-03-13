/**
 * Modern Item Detail Screen - Lavanya Mart Stock Verify
 * Clean, efficient item verification interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDebounce } from "use-debounce";
import { Image } from "expo-image";

import { useScanSessionStore } from "@/store/scanSessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { saveDraft } from "@/services/api/api";
import { CreateCountLinePayload, DateFormatType } from "@/types/scan";
import { SerialScannerModal } from "@/components/modals/SerialScannerModal";
import { OptionSelectModal } from "@/components/modals/OptionSelectModal";

import ModernHeader from "@/components/ui/ModernHeader";
import ModernCard from "@/components/ui/ModernCard";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { ThemedScreen } from "@/components/ui/ThemedScreen";
import { BatchVariantsSection } from "@/components/scan/BatchVariantsSection";
import { CountQuantitySection } from "@/components/scan/CountQuantitySection";
import { EvidenceNotesSection } from "@/components/scan/EvidenceNotesSection";
import { FlexibleDateField } from "@/components/scan/FlexibleDateField";
import { SerialEntriesSection } from "@/components/scan/SerialEntriesSection";
import { useFlexibleDateField } from "@/domains/inventory/hooks/scan/useFlexibleDateField";
import { useDeferredItemSubmission } from "@/domains/inventory/hooks/scan/useDeferredItemSubmission";
import { useItemDetailData } from "@/domains/inventory/hooks/scan/useItemDetailData";
import { useItemEvidenceState } from "@/domains/inventory/hooks/scan/useItemEvidenceState";
import { useQuantityCountManager } from "@/domains/inventory/hooks/scan/useQuantityCountManager";
import { useSerialEntryManager } from "@/domains/inventory/hooks/scan/useSerialEntryManager";
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

  // Form State
  const [quantity, setQuantity] = useState("0");
  const [mrp, setMrp] = useState("");
  const [mrpEditable, setMrpEditable] = useState(false);
  const [condition] = useState("Good");

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

  const {
    batchError,
    batchLoading,
    handleRefreshStock,
    handleSelectMrpVariant,
    isRefreshing,
    item,
    loading,
    mrpVariants,
    rawVariantsCount,
    sameNameVariants,
    selectedMrpVariant,
    setShowZeroStock,
    showZeroStock,
  } = useItemDetailData({
    barcode,
    sessionId,
    currentFloor,
    currentRack,
    onBackPress: handleBackPress,
    onMrpChange: setMrp,
    onQuantityChange: setQuantity,
  });
  const {
    handleAddSplitCount,
    handleClearSplitCounts,
    handleDecrement,
    handleIncrement,
    handleQuantityBlur,
    handleQuantityChange,
    handleRemoveSplitCount,
    handleSplitCountBlur,
    handleSplitCountChange,
    handleToggleSplitMode,
    isSplitMode,
    isWeightBasedUOM,
    resetQuantityState,
    splitCounts,
    uomInfo,
  } = useQuantityCountManager({
    item,
    quantity,
    setQuantity,
  });
  const {
    damagePhoto,
    damageQty,
    damageType,
    handleAddItemPhoto,
    handleTakeDamagePhoto,
    isDamageEnabled,
    itemPhotos,
    remark,
    removeDamagePhoto,
    removeItemPhoto,
    resetEvidenceState,
    setDamageQty,
    setDamageType,
    setIsDamageEnabled,
    setRemark,
    setVarianceRemark,
    varianceRemark,
  } = useItemEvidenceState();

  // Manufacturing & Expiry Date State (for item-level or non-serialized items)
  const [hasMfgDate, setHasMfgDate] = useState(false);
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [itemMfgDate, setItemMfgDate] = useState("");
  const [itemMfgDateFormat, setItemMfgDateFormat] =
    useState<DateFormatType>("full");
  const [itemExpiryDate, setItemExpiryDate] = useState("");
  const [itemExpiryDateFormat, setItemExpiryDateFormat] =
    useState<DateFormatType>("full");
  const mfgDateField = useFlexibleDateField({
    value: itemMfgDate,
    format: itemMfgDateFormat,
    onChangeValue: setItemMfgDate,
    onChangeFormat: setItemMfgDateFormat,
  });
  const expiryDateField = useFlexibleDateField({
    value: itemExpiryDate,
    format: itemExpiryDateFormat,
    onChangeValue: setItemExpiryDate,
    onChangeFormat: setItemExpiryDateFormat,
  });

  const [isInteractionsComplete, setIsInteractionsComplete] = useState(false);
  const {
    handleAddSerial,
    handleRemoveSerial,
    handleSerialChange,
    handleSerialScanned,
    isSerializedItem,
    resetSerialState,
    serialEntries,
    serialNumbers,
    serialValidationErrors,
    serialValidationMessages,
    setIsSerializedItem,
    setShowSerialScanner,
    showSerialScanner,
    validateSerials,
  } = useSerialEntryManager({
    item,
    mrp,
    quantity,
    sessionId,
    onQuantityChange: setQuantity,
  });

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsInteractionsComplete(true);
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    if (!item?.item_code) return;
    resetSerialState();
    resetQuantityState();
    resetEvidenceState();
  }, [item?.item_code, resetEvidenceState, resetQuantityState, resetSerialState]);

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

  const { submitting, submitCountdown, handleSubmitPress, cancelSubmit } =
    useDeferredItemSubmission({
      barcode,
      sessionId,
      currentFloor,
      currentRack,
      item,
      quantity,
      condition,
      remark,
      isDamageEnabled,
      damageQty,
      damageType,
      damagePhoto,
      itemPhotos,
      isSerializedItem,
      serialEntries,
      serialNumbers,
      serialValidationErrors,
      validateSerials,
      varianceRemark,
      mrp,
      hasMfgDate,
      itemMfgDate,
      itemMfgDateFormat,
      hasExpiryDate,
      itemExpiryDate,
      itemExpiryDateFormat,
      onSuccess: handleBackPress,
    });

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

  // Sync quantity with serial entries count for serialized items
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
          bounces
          alwaysBounceVertical
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

                <CountQuantitySection
                  isSplitMode={isSplitMode}
                  isWeightBasedUOM={isWeightBasedUOM}
                  quantity={quantity}
                  splitCounts={splitCounts}
                  uomLabel={uomInfo.label}
                  uomUnit={uomInfo.unit}
                  onAddSplitCount={handleAddSplitCount}
                  onClearSplitCounts={handleClearSplitCounts}
                  onDecrement={handleDecrement}
                  onIncrement={handleIncrement}
                  onQuantityBlur={handleQuantityBlur}
                  onQuantityChange={handleQuantityChange}
                  onRemoveSplitCount={handleRemoveSplitCount}
                  onSplitCountBlur={handleSplitCountBlur}
                  onSplitCountChange={handleSplitCountChange}
                  onToggleSplitMode={handleToggleSplitMode}
                />
              </View>

              {/* Batches */}
              <BatchVariantsSection
                variants={sameNameVariants}
                rawVariantsCount={rawVariantsCount}
                loading={batchLoading}
                error={batchError}
                showZeroStock={showZeroStock}
                onToggleShowZeroStock={setShowZeroStock}
                onSelectVariant={(variantBarcode) => {
                  router.replace({
                    pathname: "/staff/item-detail",
                    params: { barcode: variantBarcode, sessionId },
                  });
                }}
              />

              {/* Manufacturing & Expiry Date Section */}
              {(settings.columnVisibility.mfgDate ||
                settings.columnVisibility.expiryDate) && (
                <View style={styles.section}>
                  {settings.columnVisibility.mfgDate && (
                    <FlexibleDateField
                      label="Manufacturing Date"
                      enabled={hasMfgDate}
                      onToggleEnabled={(enabled) => {
                        setHasMfgDate(enabled);
                        if (!enabled) {
                          setItemMfgDate("");
                        }
                      }}
                      format={itemMfgDateFormat}
                      onChangeFormat={mfgDateField.handleFormatChange}
                      value={itemMfgDate}
                      isValid={mfgDateField.isValid}
                      isFull={mfgDateField.isFull}
                      isMonthYear={mfgDateField.isMonthYear}
                      parts={mfgDateField.parts}
                      onOpenPicker={mfgDateField.openPicker}
                      iconName="calendar-outline"
                      iconColor={colors.primary[600]}
                      trackColor={colors.primary[600]}
                    />
                  )}

                  {settings.columnVisibility.expiryDate && (
                    <View style={settings.columnVisibility.mfgDate ? styles.dateFieldSpacing : undefined}>
                      <FlexibleDateField
                        label="Expiry Date"
                        enabled={hasExpiryDate}
                        onToggleEnabled={(enabled) => {
                          setHasExpiryDate(enabled);
                          if (!enabled) {
                            setItemExpiryDate("");
                          }
                        }}
                        format={itemExpiryDateFormat}
                        onChangeFormat={expiryDateField.handleFormatChange}
                        value={itemExpiryDate}
                        isValid={expiryDateField.isValid}
                        isFull={expiryDateField.isFull}
                        isMonthYear={expiryDateField.isMonthYear}
                        parts={expiryDateField.parts}
                        onOpenPicker={expiryDateField.openPicker}
                        iconName="time-outline"
                        iconColor={colors.warning[600]}
                        trackColor={colors.warning[600]}
                      />
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
                <SerialEntriesSection
                  serialEntries={serialEntries}
                  serialValidationErrors={serialValidationErrors}
                  serialValidationMessages={serialValidationMessages}
                  onOpenScanner={() => setShowSerialScanner(true)}
                  onAddSerial={handleAddSerial}
                  onSerialChange={(index, text) =>
                    handleSerialChange(index, "serial_number", text)
                  }
                  onRemoveSerial={handleRemoveSerial}
                />
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
                              handleSelectMrpVariant(variant);
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

              <EvidenceNotesSection
                damagePhoto={damagePhoto}
                damageQty={damageQty}
                damageType={damageType}
                isDamageEnabled={isDamageEnabled}
                itemPhotos={itemPhotos}
                remark={remark}
                varianceRemark={varianceRemark}
                onAddItemPhoto={handleAddItemPhoto}
                onDamageQtyChange={setDamageQty}
                onDamageToggle={setIsDamageEnabled}
                onDamageTypeChange={setDamageType}
                onRemarkChange={setRemark}
                onRemoveDamagePhoto={removeDamagePhoto}
                onRemoveItemPhoto={removeItemPhoto}
                onTakeDamagePhoto={handleTakeDamagePhoto}
                onVarianceRemarkChange={setVarianceRemark}
              />
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
      </KeyboardAvoidingView>

      <OptionSelectModal
        visible={mfgDateField.pickerState.visible}
        title={mfgDateField.pickerState.title}
        options={mfgDateField.pickerState.options}
        onSelect={mfgDateField.selectOption}
        onClose={mfgDateField.closePicker}
      />

      <OptionSelectModal
        visible={expiryDateField.pickerState.visible}
        title={expiryDateField.pickerState.title}
        options={expiryDateField.pickerState.options}
        onSelect={expiryDateField.selectOption}
        onClose={expiryDateField.closePicker}
      />

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
  batchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  batchMrp: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
  },
  batchSub: {
    fontSize: fontSize.xs,
  },
  batchMeta: {
    fontSize: fontSize.xs,
    marginTop: 4,
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
  serialEntriesList: {
    flexGrow: 0,
  },
  serialEntriesContent: {
    paddingBottom: spacing.xs,
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
  dateFieldSpacing: {
    marginTop: spacing.md,
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
