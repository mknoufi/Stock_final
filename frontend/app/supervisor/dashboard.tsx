/**
 * Supervisor Dashboard v2.0 - Aurora Design
 *
 * Orchestrates dashboard data, navigation, haptics, and session creation.
 * Presentational sections live in focused supervisor dashboard components.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useToast } from "../../src/components/feedback/ToastProvider";
import { CreateSessionModal } from "../../src/components/supervisor/dashboard/CreateSessionModal";
import {
  OverviewAction,
  SupervisorOverviewCard,
} from "../../src/components/supervisor/dashboard/SupervisorOverviewCard";
import { SupervisorStatsSection } from "../../src/components/supervisor/dashboard/SupervisorStatsSection";
import { SupervisorActivitySection } from "../../src/components/supervisor/dashboard/SupervisorActivitySection";
import { SupervisorRecentSessionsSection } from "../../src/components/supervisor/dashboard/SupervisorRecentSessionsSection";
import {
  ActivityItem,
  DashboardStats,
  DEFAULT_ZONES,
  getFallbackWarehouses,
  WarehouseOption,
  ZoneOption,
} from "../../src/components/supervisor/dashboard/supervisorDashboardShared";
import {
  ActivityType,
  ScreenContainer,
  SpeedDialAction,
  SpeedDialMenu,
} from "../../src/components/ui";
import {
  createSession,
  getSessions,
  getWarehouses,
  getZones,
} from "../../src/services/api/api";
import { flags } from "../../src/constants/flags";
import { theme } from "../../src/styles/modernDesignSystem";
import { Session } from "../../src/types";

export default function SupervisorDashboard() {
  const router = useRouter();
  const { show } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [locationType, setLocationType] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [rackName, setRackName] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    openSessions: 0,
    closedSessions: 0,
    reconciledSessions: 0,
    totalItems: 0,
    totalVariance: 0,
    positiveVariance: 0,
    negativeVariance: 0,
    avgVariancePerSession: 0,
    highRiskSessions: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const data = await getZones();
        if (Array.isArray(data) && data.length > 0) {
          setZones(data as ZoneOption[]);
        } else {
          setZones(DEFAULT_ZONES);
        }
      } catch (error) {
        console.error("Failed to fetch zones:", error);
        setZones(DEFAULT_ZONES);
      }
    };

    fetchZones();
  }, []);

  const handleLocationTypeChange = async (type: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();

    setLocationType(type);
    setSelectedFloor(null);

    try {
      setIsLoadingWarehouses(true);
      const data = await getWarehouses(type);
      if (Array.isArray(data) && data.length > 0) {
        setWarehouses(data as WarehouseOption[]);
      } else {
        setWarehouses(getFallbackWarehouses(type));
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
      setWarehouses(getFallbackWarehouses(type));
    } finally {
      setIsLoadingWarehouses(false);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const sessionsRes = await getSessions(1, 100);
      const sessionData = sessionsRes.items || [];
      setSessions(sessionData);

      const nextStats = sessionData.reduce(
        (acc: DashboardStats, session: Session) => {
          acc.totalSessions++;
          if (session.status === "OPEN") acc.openSessions++;
          if (session.status === "CLOSED") acc.closedSessions++;
          if (session.status === "RECONCILE") acc.reconciledSessions++;

          acc.totalItems += session.total_items || 0;
          acc.totalVariance += session.total_variance || 0;

          if ((session.total_variance || 0) > 0) {
            acc.positiveVariance += session.total_variance;
          }
          if ((session.total_variance || 0) < 0) {
            acc.negativeVariance += session.total_variance;
          }
          if (Math.abs(session.total_variance ?? 0) > 1000) {
            acc.highRiskSessions++;
          }

          return acc;
        },
        {
          totalSessions: 0,
          openSessions: 0,
          closedSessions: 0,
          reconciledSessions: 0,
          totalItems: 0,
          totalVariance: 0,
          positiveVariance: 0,
          negativeVariance: 0,
          avgVariancePerSession: 0,
          highRiskSessions: 0,
        },
      );

      nextStats.avgVariancePerSession =
        nextStats.totalSessions > 0
          ? nextStats.totalVariance / nextStats.totalSessions
          : 0;

      setStats(nextStats);

      const recentActivities: ActivityItem[] = sessionData
        .slice(0, 10)
        .map((session: Session) => ({
          id: session.id,
          type: "session" as ActivityType,
          title: `Session ${session.status.toLowerCase()}`,
          description: `${session.warehouse} - ${session.staff_name || "Unknown"} - ${session.total_items} items`,
          timestamp: new Date(session.started_at),
          status:
            session.status === "OPEN"
              ? "info"
              : session.status === "CLOSED"
                ? "success"
                : "warning",
        }));

      setActivities(recentActivities);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSession = async () => {
    if (!locationType || !selectedFloor || !rackName.trim()) {
      show("Please fill in all fields", "warning");
      return;
    }

    try {
      setIsCreatingSession(true);
      const normalizedRack = rackName.trim().toUpperCase();
      const warehouseName = `${locationType} - ${selectedFloor} - ${normalizedRack}`;

      const session = await createSession({
        warehouse: warehouseName,
        type: "STANDARD",
        location_type: locationType,
        location_name: selectedFloor,
        rack_no: normalizedRack,
      });

      show("Session created successfully", "success");
      setShowCreateSessionModal(false);
      setLocationType(null);
      setSelectedFloor(null);
      setRackName("");

      loadData();
      router.push(`/supervisor/session/${session.id}` as any);
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create session";
      show(errorMessage, "error");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const onRefresh = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    loadData();
  };

  const handleStatPress = (statType: "total" | "open" | "items" | "risk") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    switch (statType) {
      case "total":
      case "open":
        router.push("/supervisor/sessions" as any);
        break;
      case "items":
        router.push("/supervisor/items" as any);
        break;
      case "risk":
        router.push("/supervisor/variances" as any);
        break;
    }
  };

  const speedDialActions: SpeedDialAction[] = [
    {
      icon: "add-circle-outline",
      label: "New Session",
      onPress: () => setShowCreateSessionModal(true),
    },
    {
      icon: "albums-outline",
      label: "Sessions",
      onPress: () => router.push("/supervisor/sessions" as any),
    },
    {
      icon: "alert-circle-outline",
      label: "Variances",
      onPress: () => router.push("/supervisor/variances" as any),
    },
    {
      icon: "eye-outline",
      label: "Watchtower",
      onPress: () => router.push("/supervisor/watchtower" as any),
    },
    {
      icon: "git-network-outline",
      label: "User Workflows",
      onPress: () => router.push("/supervisor/user-workflows" as any),
    },
    ...(flags.enableNotes
      ? [
          {
            icon: "document-text-outline",
            label: "Notes",
            onPress: () => router.push("/supervisor/notes" as any),
          } satisfies SpeedDialAction,
        ]
      : []),
    {
      icon: "cloud-offline-outline",
      label: "Offline Queue",
      onPress: () => router.push("/supervisor/offline-queue" as any),
    },
    {
      icon: "download-outline",
      label: "Exports",
      onPress: () => router.push("/supervisor/export" as any),
    },
    {
      icon: "settings-outline",
      label: "Settings",
      onPress: () => router.push("/supervisor/settings" as any),
    },
  ];

  const overviewActions: OverviewAction[] = [
    {
      key: "new-session",
      icon: "add-circle-outline",
      label: "Create session",
      onPress: () => setShowCreateSessionModal(true),
      primary: true,
    },
    {
      key: "review-variances",
      icon: "alert-circle-outline",
      label: "Review variances",
      onPress: () => router.push("/supervisor/variances" as any),
      primary: false,
    },
  ];

  const completionPercentage =
    stats.totalSessions > 0
      ? ((stats.closedSessions + stats.reconciledSessions) /
          stats.totalSessions) *
        100
      : 0;

  return (
    <ScreenContainer
      header={{
        title: "Supervisor Dashboard",
        subtitle: "Operations overview",
        showUsername: true,
        showLogoutButton: true,
        rightAction: {
          icon: "settings-outline",
          onPress: () => router.push("/supervisor/settings" as any),
        },
      }}
      backgroundType="aurora"
      statusBarStyle="light"
      contentMode="static"
      noPadding
    >
      {loading && !refreshing ? (
        <View style={styles.loadingState}>
          <Ionicons
            name="cube-outline"
            size={48}
            color={theme.colors.primary[500]}
            style={styles.loadingIcon}
          />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary[500]}
              colors={[theme.colors.primary[500]]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <SupervisorOverviewCard
            completionPercentage={completionPercentage}
            highRiskSessions={stats.highRiskSessions}
            openSessions={stats.openSessions}
            overviewActions={overviewActions}
          />

          <SupervisorStatsSection
            completionPercentage={completionPercentage}
            onStatPress={handleStatPress}
            stats={stats}
          />

          <SupervisorActivitySection
            activities={activities}
            onOpenActivity={(activityId) =>
              router.push(`/supervisor/session/${activityId}` as any)
            }
            onViewAll={() => router.push("/supervisor/activity-logs" as any)}
          />

          <SupervisorRecentSessionsSection
            onOpenSession={(sessionId) =>
              router.push(`/supervisor/session/${sessionId}` as any)
            }
            onViewAll={() => router.push("/supervisor/sessions" as any)}
            sessions={sessions}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      <CreateSessionModal
        isCreatingSession={isCreatingSession}
        isLoadingWarehouses={isLoadingWarehouses}
        locationType={locationType}
        onChangeLocationType={handleLocationTypeChange}
        onChangeRackName={setRackName}
        onChangeSelectedFloor={(value) => {
          if (Platform.OS !== "web") Haptics.selectionAsync();
          setSelectedFloor(value);
        }}
        onClose={() => setShowCreateSessionModal(false)}
        onSubmit={handleCreateSession}
        rackName={rackName}
        selectedFloor={selectedFloor}
        visible={showCreateSessionModal}
        warehouses={warehouses}
        zones={zones}
      />

      <SpeedDialMenu actions={speedDialActions} position="bottom-right" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    color: theme.colors.text.secondary,
  },
  bottomSpacer: {
    height: 100,
  },
});
