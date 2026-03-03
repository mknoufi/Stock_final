/**
 * Modern Scan Screen - Lavanya Mart Stock Verify
 * Clean, efficient scanning interface
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

import { useSafeAsync } from "../../src/hooks/useSafeAsync";
import { usePerformanceMonitor } from "../../src/hooks/usePerformanceMonitor";
import { useScanSessionStore } from "../../src/store/scanSessionStore";
import { useWebSocket } from "../../src/hooks/useWebSocket";
import {
  getItemByBarcode,
  searchItems,
  updateSessionStatus,
  checkItemScanStatus,
  getSessionStats,
  SessionStatsResponse,
} from "../../src/services/api/api";
import { RecentItemsService } from "../../src/services/enhancedFeatures";
import { toastService } from "../../src/services/utils/toastService";
import { localDb } from "../../src/db/localDb";
import { validateBarcode } from "../../src/utils/validation";
import { dedupeSearchResultsPreferHigherStock } from "../../src/utils/searchResultDedup";

import ModernHeader from "../../src/components/ui/ModernHeader";
import ModernCard from "../../src/components/ui/ModernCard";
import ModernButton from "../../src/components/ui/ModernButton";
import ModernInput from "../../src/components/ui/ModernInput";
import { SyncStatusPill } from "../../src/components/ui/SyncStatusPill";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../../src/theme/modernDesign";

import { useAuthStore } from "../../src/store/authStore";

const SCAN_BUFFER_TIMEOUT = 2000; // 2 seconds
const SCAN_BUFFER_MAX_SIZE = 10;
const SCAN_CONFIDENCE_THRESHOLD = 2;

const ScanScreen = React.memo(function ScanScreen() {
  const router = useRouter();
  const { sessionId: rawSessionId } = useLocalSearchParams();
  const sessionId = Array.isArray(rawSessionId)
    ? rawSessionId[0]
    : rawSessionId;

  const { user, logout } = useAuthStore();

  const { currentFloor, currentRack } = useScanSessionStore();
  const [permission, requestPermission] = useCameraPermissions();
  const { safeSetState, safeAsync } = useSafeAsync();
  const {
    metrics: performanceMetrics,
    startMonitoring,
    stopMonitoring,
    performanceWarning,
  } = usePerformanceMonitor({
    sampleInterval: 2000,
    performanceThreshold: 25,
  });

  // WebSocket Integration
  const { lastMessage } = useWebSocket(String(sessionId));

  // State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStatsResponse>({
    id: String(sessionId ?? ""),
    scannedItems: 0,
    verifiedItems: 0,
    pendingItems: 0,
    totalItems: 0,
  });
  const [showCloseSessionModal, setShowCloseSessionModal] =
    useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Animation values for scan frame
  const scanLinePosition = useSharedValue(0);
  const cornerOpacity = useSharedValue(1);

  const scanBufferRef = useRef<
    { code: string; count: number; timestamp: number }[]
  >([]);

  const loadRecentItems = useCallback(async () => {
    try {
      const items = await safeAsync(() => RecentItemsService.getRecentItems());
      if (items) {
        safeSetState(setRecentItems, items);
      }
    } catch (error) {
      console.error("Failed to load recent items", error);
    }
  }, [safeAsync, safeSetState]);

  const loadSessionStats = useCallback(async () => {
    if (!sessionId) return;
    try {
      const stats = await safeAsync(() => getSessionStats(sessionId));
      if (stats) {
        safeSetState(setSessionStats, stats);
      }
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  }, [safeAsync, safeSetState, sessionId]);

  const performSearch = useCallback(
    async (query: string) => {
      try {
        const results = await safeAsync(() => searchItems(query));
        if (results) {
          const items = Array.isArray(results.items) ? results.items : [];
          safeSetState(
            setSearchResults,
            dedupeSearchResultsPreferHigherStock(items),
          );
        }
      } catch (error) {
        console.error("Search failed", error);
      }
    },
    [safeAsync, safeSetState],
  );

  const loadInitialData = useCallback(async () => {
    safeSetState(setInitialLoading, true);
    await Promise.all([loadRecentItems(), loadSessionStats()]);
    safeSetState(setInitialLoading, false);
  }, [loadRecentItems, loadSessionStats, safeSetState]);

  const onRefresh = useCallback(async () => {
    safeSetState(setRefreshing, true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([loadRecentItems(), loadSessionStats()]);
    safeSetState(setRefreshing, false);
  }, [loadRecentItems, loadSessionStats, safeSetState]);

  // Animated scan line
  useEffect(() => {
    if (isScanning) {
      scanLinePosition.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
      cornerOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 }),
        ),
        -1,
        false,
      );
    }
  }, [cornerOpacity, isScanning, scanLinePosition]);

  const animatedScanLine = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value * 200 }],
  }));

  const animatedCorners = useAnimatedStyle(() => ({
    opacity: cornerOpacity.value,
  }));

  // Handle WebSocket Messages
  useEffect(() => {
    if (lastMessage?.type === "session_update") {
      const { status, reason } = lastMessage.payload;

      if (status === "PAUSED") {
        safeSetState(setIsScanning, false);
        Alert.alert(
          "Session Paused",
          reason || "A supervisor has paused this session.",
          [{ text: "OK" }],
        );
      } else if (status === "CLOSED" && !isFinishing) {
        Alert.alert(
          "Session Closed",
          reason || "This session has been closed.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/staff/home"),
            },
          ],
        );
      }

      // Refresh stats on any update
      loadSessionStats();
    }
  }, [isFinishing, lastMessage, loadSessionStats, router, safeSetState]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Start performance monitoring when component mounts
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Load initial data (legacy - kept for compatibility)
  useEffect(() => {
    loadRecentItems();
    loadSessionStats();

    // Poll stats every 30s
    const interval = setInterval(loadSessionStats, 30000);
    return () => clearInterval(interval);
  }, [loadRecentItems, loadSessionStats]);

  // Search effect with proper cleanup
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 2) {
      performSearch(debouncedSearchQuery);
    } else {
      safeSetState(setSearchResults, []);
    }
  }, [debouncedSearchQuery, performSearch, safeSetState]);

  const handleBarcodeScan = async ({ data }: { data: string }) => {
    if (scanned) return;

    const now = Date.now();
    const trimmedData = data.trim();

    // Buffer logic
    scanBufferRef.current = scanBufferRef.current.filter(
      (entry) => now - entry.timestamp < SCAN_BUFFER_TIMEOUT,
    );

    const existingIndex = scanBufferRef.current.findIndex(
      (entry) => entry.code === trimmedData,
    );

    if (existingIndex >= 0) {
      scanBufferRef.current[existingIndex]!.count += 1;
      scanBufferRef.current[existingIndex]!.timestamp = now;
    } else {
      scanBufferRef.current.push({
        code: trimmedData,
        count: 1,
        timestamp: now,
      });
    }

    if (scanBufferRef.current.length > SCAN_BUFFER_MAX_SIZE) {
      scanBufferRef.current =
        scanBufferRef.current.slice(-SCAN_BUFFER_MAX_SIZE);
    }

    const confident = scanBufferRef.current.find(
      (entry) => entry.count >= SCAN_CONFIDENCE_THRESHOLD,
    );

    if (!confident) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    safeSetState(setScanned, true);
    scanBufferRef.current = [];
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    safeSetState(setIsScanning, false);

    await handleLookup(confident.code);
  };

  const handleLookup = async (barcode: string) => {
    if (loading) return;
    const validation = validateBarcode(barcode);
    if (!validation.valid) {
      Alert.alert("Invalid Barcode", validation.error || "Please try again");
      safeSetState(setScanned, false);
      return;
    }

    safeSetState(setLoading, true);
    try {
      let item: any;

      // OPTIMISTIC STRATEGY: Try Local DB first for instant response
      try {
        item = await safeAsync(() =>
          localDb.getItemByBarcode(validation.value!),
        );
      } catch {
        // Ignore local db error, fall through to API
      }

      // If not found locally, force API lookup
      if (!item) {
        try {
          item = await safeAsync(() => getItemByBarcode(validation.value!));
        } catch (e) {
          throw e;
        }
      }

      if (item) {
        await safeAsync(() =>
          RecentItemsService.addRecent(item.item_code, item),
        );
        await loadRecentItems();

        // Check for duplicates
        try {
          const scanStatus = await safeAsync(() =>
            checkItemScanStatus(sessionId!, item.item_code),
          );
          if (scanStatus?.scanned) {
            const locations = scanStatus.locations || [];
            const duplicateInLocation = locations.find(
              (loc: any) =>
                loc.floor_no === currentFloor && loc.rack_no === currentRack,
            );

            if (duplicateInLocation) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning,
              );
              safeSetState(setLoading, false);
              safeSetState(setScanned, false);
              Alert.alert(
                "Duplicate Scan",
                `Item already counted here by ${duplicateInLocation.counted_by}.\nQty: ${duplicateInLocation.counted_qty}`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Verify / Update",
                    onPress: () =>
                      navigateToDetail(item.barcode || validation.value!),
                  },
                ],
              );
              return;
            } else {
              toastService.show(
                `Item found in ${locations.length} other location(s)`,
                {
                  type: "info",
                },
              );
            }
          }
        } catch (_error) {
          // Ignore check status error
        }

        navigateToDetail(item.barcode || validation.value!);
      } else {
        Alert.alert("Not Found", "Item not found in database");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to lookup item");
    } finally {
      safeSetState(setLoading, false);
      safeSetState(setScanned, false);
    }
  };

  const navigateToDetail = (barcode: string) => {
    safeSetState(setSearchQuery, "");
    router.push({
      pathname: "/staff/item-detail",
      params: { barcode, sessionId: sessionId! },
    } as any);
  };

  const handleFinishRack = async () => {
    if (!sessionId) return;
    safeSetState(setIsFinishing, true);
    try {
      await safeAsync(() => updateSessionStatus(sessionId, "closed"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/staff/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to close session");
    } finally {
      safeSetState(setIsFinishing, false);
      safeSetState(setShowCloseSessionModal, false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out ending your session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              if (sessionId) {
                // Optional: updateSessionStatus(sessionId, "paused");
              }
              await logout();
              router.replace("/auth/login");
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    );
  };

  if (isScanning) {
    if (!permission) {
      // Camera permissions are still loading
      return <View />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <ModernButton onPress={requestPermission} title="Grant Permission" />
          <ModernButton
            onPress={() => safeSetState(setIsScanning, false)}
            title="Cancel"
            variant="outline"
            style={{ marginTop: spacing.md }}
          />
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScan}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "qr",
            ],
          }}
        >
          <SafeAreaView style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                onPress={() => safeSetState(setIsScanning, false)}
                style={styles.closeCameraButton}
              >
                <Ionicons name="close" size={28} color={colors.white} />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Barcode</Text>
            </View>

            <View style={styles.scanFrameContainer}>
              {/* Animated Scan Frame with Corner Brackets */}
              <View style={styles.scanFrameWrapper}>
                {/* Corner Brackets */}
                <Animated.View
                  style={[
                    styles.cornerBracket,
                    styles.cornerTopLeft,
                    animatedCorners,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.cornerBracket,
                    styles.cornerTopRight,
                    animatedCorners,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.cornerBracket,
                    styles.cornerBottomLeft,
                    animatedCorners,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.cornerBracket,
                    styles.cornerBottomRight,
                    animatedCorners,
                  ]}
                />

                {/* Animated Scan Line */}
                <Animated.View style={[styles.scanLine, animatedScanLine]} />
              </View>
              <Text style={styles.scanInstruction}>
                Align barcode within frame
              </Text>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  // Skeleton Loader Component
  const SkeletonLoader = ({ style }: { style?: any }) => (
    <View style={[styles.skeleton, style]}>
      <Animated.View
        style={styles.skeletonShimmer}
        entering={FadeInDown.duration(300)}
      />
    </View>
  );

  // Empty State Component
  const EmptyState = ({
    icon,
    title,
    subtitle,
  }: {
    icon: string;
    title: string;
    subtitle: string;
  }) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon as any} size={48} color={colors.gray[300]} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );

  const buildItemKey = (item: any, index: number) => {
    const code = item?.item_code ?? "no-code";
    const barcode = item?.barcode ?? "no-barcode";
    const id = item?.id ?? item?._id ?? "no-id";
    return `${code}-${barcode}-${id}-${index}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ModernHeader
        title={`Welcome, ${user?.full_name?.split(" ")[0] || "Staff"}`}
        subtitle={`${currentFloor || ""} ${currentRack ? `• ${currentRack}` : ""}`}
        showBackButton={false}
        onBackPress={() => router.back()}
        rightComponent={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SyncStatusPill />
            <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
              <Ionicons name="log-out-outline" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>
        }
      />


      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[600]}
            colors={[colors.primary[600]]}
          />
        }
      >
        {/* Stats Card */}
        <Animated.View entering={FadeInDown.duration(500)}>
          {initialLoading ? (
            <ModernCard style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <SkeletonLoader
                    style={{ width: 48, height: 32, borderRadius: 8 }}
                  />
                  <SkeletonLoader
                    style={{
                      width: 60,
                      height: 12,
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <SkeletonLoader
                    style={{ width: 48, height: 32, borderRadius: 8 }}
                  />
                  <SkeletonLoader
                    style={{
                      width: 60,
                      height: 12,
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <SkeletonLoader
                    style={{ width: 48, height: 32, borderRadius: 8 }}
                  />
                  <SkeletonLoader
                    style={{
                      width: 60,
                      height: 12,
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </ModernCard>
          ) : (
            <ModernCard style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {sessionStats.scannedItems}
                  </Text>
                  <Text style={styles.statLabel}>Scanned</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statValue, { color: colors.success[600] }]}
                  >
                    {sessionStats.verifiedItems}
                  </Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statValue, { color: colors.warning[600] }]}
                  >
                    {sessionStats.pendingItems}
                  </Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>
            </ModernCard>
          )}
        </Animated.View>

        {/* Search Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.searchSection}
        >
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <ModernInput
                placeholder="Enter barcode or item code..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                icon="search"
                rightIcon={searchQuery ? "close-circle" : undefined}
                onRightIconPress={() => safeSetState(setSearchQuery, "")}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleLookup(searchQuery.trim());
                  }
                }}
                returnKeyType="search"
                keyboardType="default"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.searchButton,
                loading && styles.searchButtonDisabled,
              ]}
              testID="scan-search-submit"
              onPress={() => {
                if (searchQuery.trim()) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleLookup(searchQuery.trim());
                } else {
                  safeSetState(setIsScanning, true);
                }
              }}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons
                name={searchQuery.trim() ? "arrow-forward" : "scan"}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {searchResults.map((item, index) => (
                <React.Fragment key={buildItemKey(item, index)}>
                  <SearchResultItem
                    item={item}
                    onPress={() => handleLookup(item.barcode || item.item_code)}
                  />
                  {index < searchResults.length - 1 && (
                    <View style={styles.searchResultSeparator} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Recent Items - Only show when not searching */}
        {searchResults.length === 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.recentSection}
          >
            <Text style={styles.sectionTitle}>Recent Items</Text>

            {initialLoading ? (
              // Loading Skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <ModernCard key={i} style={styles.recentCard}>
                    <View style={styles.recentRow}>
                      <SkeletonLoader
                        style={{ width: 44, height: 44, borderRadius: 12 }}
                      />
                      <View
                        style={[styles.recentInfo, { marginLeft: spacing.md }]}
                      >
                        <SkeletonLoader
                          style={{ width: "80%", height: 16, borderRadius: 4 }}
                        />
                        <SkeletonLoader
                          style={{
                            width: "50%",
                            height: 12,
                            marginTop: 6,
                            borderRadius: 4,
                          }}
                        />
                      </View>
                    </View>
                  </ModernCard>
                ))}
              </>
            ) : recentItems.length === 0 ? (
              // Empty State
              <EmptyState
                icon="time-outline"
                title="No Recent Scans"
                subtitle="Items you scan will appear here for quick access"
              />
            ) : (
              <View style={styles.recentListContainer}>
                {recentItems.slice(0, 5).map((item, index) => (
                  <RecentItemCard
                    key={buildItemKey(item, index)}
                    item={item}
                    onPress={() => handleLookup(item.barcode || item.item_code)}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <ModernButton
          title="Finish Rack"
          onPress={() => safeSetState(setShowCloseSessionModal, true)}
          variant="primary"
          icon="checkmark-circle"
          fullWidth
        />
      </View>

      {/* Close Session Modal - Enterprise Standard */}
      <Modal
        visible={showCloseSessionModal}
        transparent
        animationType="fade"
        onRequestClose={() => safeSetState(setShowCloseSessionModal, false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={styles.modalContent}
          >
            {/* Modal Icon */}
            <View style={styles.modalIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={colors.success[500]}
              />
            </View>

            <Text style={styles.modalTitle}>Complete Rack Scan?</Text>
            <Text style={styles.modalText}>
              This will finalize the scan for {currentFloor || "this location"}{" "}
              {currentRack ? `• ${currentRack}` : ""}. You won't be able to add
              more items after confirming.
            </Text>

            {/* Session Summary */}
            <View style={styles.modalSummary}>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Items Scanned</Text>
                <Text style={styles.modalSummaryValue}>
                  {sessionStats.scannedItems}
                </Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Verified</Text>
                <Text
                  style={[
                    styles.modalSummaryValue,
                    { color: colors.success[600] },
                  ]}
                >
                  {sessionStats.verifiedItems}
                </Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Pending Review</Text>
                <Text
                  style={[
                    styles.modalSummaryValue,
                    { color: colors.warning[600] },
                  ]}
                >
                  {sessionStats.pendingItems}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <ModernButton
                title="Keep Scanning"
                onPress={() => safeSetState(setShowCloseSessionModal, false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.md }} />
              <ModernButton
                title="Complete"
                onPress={handleFinishRack}
                loading={isFinishing}
                icon="checkmark"
                style={{ flex: 1 }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>

      {loading && (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      )}

      {/* Performance Monitor Overlay */}
      {__DEV__ && (
        <View
          style={[
            styles.performanceOverlay,
            performanceWarning
              ? styles.performancePoor
              : styles.performanceGood,
          ]}
        >
          <Text style={styles.performanceText}>
            FPS: {performanceMetrics.fps ?? "--"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
});

// Optimized Recent Item Card Component
type RecentItemCardProps = { item: any; onPress: () => void };
const RecentItemCard = React.memo(function RecentItemCard(
  props: RecentItemCardProps,
) {
  const { item, onPress } = props;
  return (
    <ModernCard style={styles.recentCard} onPress={onPress}>
      <View style={styles.recentRow}>
        <View style={styles.recentIcon}>
          <Ionicons name="cube-outline" size={22} color={colors.primary[600]} />
        </View>
        <View style={styles.recentInfo}>
          <Text style={styles.recentName} numberOfLines={1}>
            {item.item_name}
          </Text>
          <Text style={styles.recentCode}>{item.item_code}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
      </View>
    </ModernCard>
  );
});

// Optimized Search Result Item Component
type SearchResultItemProps = { item: any; onPress: () => void };
const SearchResultItem = React.memo(function SearchResultItem(
  props: SearchResultItemProps,
) {
  const { item, onPress } = props;
  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="cube-outline" size={20} color={colors.primary[600]} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.item_name}</Text>
        <Text style={styles.resultCode}>{item.item_code}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );
});

RecentItemCard.displayName = "RecentItemCard";
SearchResultItem.displayName = "SearchResultItem";

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray[200],
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.gray[900],
    marginBottom: spacing.xs,
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  searchSection: {
    marginBottom: spacing.xl,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    ...shadows.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  searchButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  searchButtonDisabled: {
    backgroundColor: colors.gray[300],
    shadowOpacity: 0,
  },
  searchResults: {
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    ...shadows.lg,
    zIndex: 200,
    elevation: 10,
  },
  searchResultsContainer: {
    paddingVertical: spacing.xs,
  },
  searchResultSeparator: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[900],
  },
  resultCode: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  fabContainer: {
    display: "none",
  },
  fabButton: {
    display: "none",
  },
  recentSection: {
    marginBottom: spacing.lg,
  },
  recentListContainer: {
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    color: colors.gray[500],
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: spacing.xs,
  },
  recentCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: 2,
  },
  recentCode: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  footerSpacer: {
    height: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 34 : spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    ...shadows.lg,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: Platform.OS === "android" ? spacing.xl : spacing.lg,
  },
  closeCameraButton: {
    padding: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: borderRadius.full,
  },
  cameraTitle: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.md,
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 0,
    borderRadius: borderRadius.xl,
  },
  scanInstruction: {
    color: colors.white,
    marginTop: spacing.xl,
    fontSize: typography.fontSize.base,
    fontWeight: "500",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.gray[50],
  },
  permissionText: {
    fontSize: typography.fontSize.lg,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.gray[700],
    lineHeight: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius["2xl"],
    padding: spacing.xl,
    ...shadows.xl,
  },
  modalIconContainer: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: "800",
    color: colors.gray[900],
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  modalText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    marginBottom: spacing.xl,
    lineHeight: 24,
    textAlign: "center",
  },
  modalSummary: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  modalSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalSummaryLabel: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    fontWeight: "500",
  },
  modalSummaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.gray[900],
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderStyle: "dashed",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    textAlign: "center",
    lineHeight: 20,
  },
  skeleton: {
    backgroundColor: colors.gray[200],
    overflow: "hidden",
  },
  skeletonShimmer: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  scanFrameWrapper: {
    width: 280,
    height: 280,
    position: "relative",
  },
  cornerBracket: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.white,
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: borderRadius.xl,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: borderRadius.xl,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.xl,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: borderRadius.xl,
  },
  scanLine: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 0,
    height: 2,
    backgroundColor: colors.primary[400],
    shadowColor: colors.primary[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  performanceOverlay: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    zIndex: 1001,
  },
  performanceText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  performanceGood: {
    backgroundColor: "rgba(34,197,94,0.8)",
  },
  performancePoor: {
    backgroundColor: "rgba(239,68,68,0.8)",
  },
});
