/**
 * Admin Dashboard Web v2.0 - Aurora Design System
 *
 * Features:
 * - Real-time system monitoring (Health, Stats, Sessions)
 * - Interactive charts (Line, Bar, Pie)
 * - Detailed reporting engine
 * - Analytics and metrics
 * - Aurora UI components (Glassmorphism, Gradients)
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getServicesStatus,
  getSystemIssues,
  getSystemHealthScore,
  getSystemStats,
  getMetricsStats,
  getMetricsHealth,
  getSessionsAnalytics,
  getAvailableReports,
  generateReport,
  getSessions,
  getDiagnosisHealth,
  attemptAutoFixDiagnosis,
  startService,
  stopService,
} from "../../src/services/api";

import { ScreenContainer } from "../../src/components/ui/ScreenContainer";
import {
  DashboardAnalyticsPanel,
  DashboardDiagnosisPanel,
  DashboardMonitoringPanel,
  DashboardOverviewPanel,
  DashboardReportsPanel,
  DashboardTabBar,
} from "../../src/components/admin/dashboard/DashboardPanels";
import { DashboardReportModal } from "../../src/components/admin/dashboard/DashboardReportModal";
import { auroraTheme } from "../../src/theme/auroraTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const normalizeDashboardMetrics = (payload: unknown) => {
  const response = asRecord(payload);
  const stats = response.data ? asRecord(response.data) : response;
  if (Object.keys(stats).length === 0) return null;

  const services = asRecord(stats.services);
  const requests = asRecord(services.requests);
  const performance = asRecord(services.performance);
  const uptime = asRecord(services.uptime);

  const totalRequests = Number(requests.total || 0);
  const uptimeSeconds = Number(uptime.seconds || 0);
  const rawErrorRate = Number(requests.error_rate || 0);
  const hasRequestMetrics =
    Object.keys(requests).length > 0 || Object.keys(performance).length > 0;

  return {
    ...stats,
    request_metrics: hasRequestMetrics
      ? {
          avg_response_time: Number(performance.avg_response_time || 0),
          requests_per_minute:
            uptimeSeconds > 0
              ? totalRequests / Math.max(uptimeSeconds / 60, 1 / 60)
              : totalRequests,
          error_rate: rawErrorRate > 1 ? rawErrorRate / 100 : rawErrorRate,
          total_requests: totalRequests,
        }
      : null,
  };
};

type DashboardTab =
  | "overview"
  | "monitoring"
  | "reports"
  | "analytics"
  | "diagnosis";

const DASHBOARD_TABS: DashboardTab[] = [
  "overview",
  "monitoring",
  "reports",
  "analytics",
  "diagnosis",
];

const isDashboardTab = (value: unknown): value is DashboardTab =>
  typeof value === "string" &&
  DASHBOARD_TABS.includes(value as DashboardTab);

// Typography helper to map Aurora tokens to styles
const typography = {
  h1: {
    fontFamily: auroraTheme.typography.fontFamily.display,
    fontSize: auroraTheme.typography.fontSize["4xl"],
    fontWeight: "800" as const,
    color: auroraTheme.colors.text.primary,
  },
  h2: {
    fontFamily: auroraTheme.typography.fontFamily.heading,
    fontSize: auroraTheme.typography.fontSize["2xl"],
    fontWeight: "700" as const,
    color: auroraTheme.colors.text.primary,
  },
  h3: {
    fontFamily: auroraTheme.typography.fontFamily.heading,
    fontSize: auroraTheme.typography.fontSize.xl,
    fontWeight: "600" as const,
    color: auroraTheme.colors.text.primary,
  },
  body: {
    fontFamily: auroraTheme.typography.fontFamily.body,
    fontSize: auroraTheme.typography.fontSize.base,
    color: auroraTheme.colors.text.secondary,
  },
  bodyStrong: {
    fontFamily: auroraTheme.typography.fontFamily.body,
    fontSize: auroraTheme.typography.fontSize.base,
    fontWeight: "600" as const,
    color: auroraTheme.colors.text.primary,
  },
  small: {
    fontFamily: auroraTheme.typography.fontFamily.body,
    fontSize: auroraTheme.typography.fontSize.sm,
    color: auroraTheme.colors.text.tertiary,
  },
  label: {
    fontFamily: auroraTheme.typography.fontFamily.label,
    fontSize: auroraTheme.typography.fontSize.sm,
    fontWeight: "600" as const,
    color: auroraTheme.colors.text.secondary,
  },
};

export default function DashboardWeb() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    isDashboardTab(tab) ? tab : "overview",
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setLastUpdate] = useState<Date>(new Date());
  const [serviceActionLoading, setServiceActionLoading] = useState<string | null>(
    null,
  );

  // Data States
  const [systemStats, setSystemStats] = useState<any>(null);
  const [servicesStatus, setServicesStatus] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [sessionsAnalytics, setSessionsAnalytics] = useState<any>(null);
  const [diagnosisHealth, setDiagnosisHealth] = useState<any>(null);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportFormat, setReportFormat] = useState<"excel" | "csv" | "json">(
    "excel",
  );
  const [reportDateRange, setReportDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  // Analytics State
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const fetchAvailableReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const response = await getAvailableReports();
      setReports(response?.data?.reports || []);
    } catch {
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);

      const [
        servicesRes,
        statsRes,
        metricsRes,
        _healthRes,
        _reportsRes,
        issuesRes,
        healthScoreRes,
        _sessionsRes,
        analyticsRes,
        diagnosisHealthRes,
      ] = await Promise.allSettled([
        getServicesStatus().catch(() => ({ data: null })),
        getSystemStats().catch(() => ({ data: null })),
        getMetricsStats().catch(() => ({ data: null })),
        getMetricsHealth().catch(() => ({ data: null })),
        fetchAvailableReports(),
        getSystemIssues().catch(() => ({ data: { issues: [] } })),
        getSystemHealthScore().catch(() => ({ data: null })),
        getSessions(1, 100).catch(() => ({ data: { sessions: [] } })),
        getSessionsAnalytics().catch(() => ({ data: null })),
        getDiagnosisHealth().catch(() => null),
      ]);

      if (servicesRes.status === "fulfilled")
        setServicesStatus(servicesRes.value?.data);
      if (statsRes.status === "fulfilled") setSystemStats(statsRes.value?.data);
      if (metricsRes.status === "fulfilled")
        setMetrics(normalizeDashboardMetrics(metricsRes.value));
      if (issuesRes.status === "fulfilled")
        setIssues(issuesRes.value?.data?.issues || []);
      if (healthScoreRes.status === "fulfilled")
        setHealthScore(healthScoreRes.value?.data?.score);
      if (analyticsRes.status === "fulfilled")
        setSessionsAnalytics(analyticsRes.value?.data);
      if (diagnosisHealthRes.status === "fulfilled")
        setDiagnosisHealth(diagnosisHealthRes.value);

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchAvailableReports]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => loadDashboardData(), 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  useEffect(() => {
    if (isDashboardTab(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (
      activeTab === "reports" &&
      reports.length === 0 &&
      !reportsLoading &&
      !loading
    ) {
      void fetchAvailableReports();
    }
  }, [activeTab, fetchAvailableReports, loading, reports.length, reportsLoading]);

  const toYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGenerateReport = async (reportType: string) => {
    setGenerating(true);
    try {
      const result = await generateReport(reportType, {
        format: reportFormat,
        startDate: toYMD(reportDateRange.start),
        endDate: toYMD(reportDateRange.end),
      });

      if (result.kind === "json") {
        Alert.alert(
          "Report Ready",
          `Report "${reportType}" generated successfully.`,
        );
        setShowReportModal(false);
        return;
      }

      if (isWeb && "blob" in result) {
        if (result.blob.size === 0) {
          Alert.alert(
            "No Data",
            "No records found for the selected date range.",
          );
          return;
        }
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", result.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setShowReportModal(false);
        return;
      }

      Alert.alert(
        "Download Not Supported",
        "Report download is currently supported in the web dashboard.",
      );
      setShowReportModal(false);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const prepareSessionChartData = () => {
    if (
      !sessionsAnalytics?.sessions_by_date ||
      Object.keys(sessionsAnalytics.sessions_by_date).length === 0
    ) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day) => ({
        x: day,
        y: 0,
      }));
    }

    // Sort dates and take last 7 days
    const sortedDates = Object.keys(sessionsAnalytics.sessions_by_date).sort();
    const last7Dates = sortedDates.slice(-7);

    return last7Dates.map((date) => {
      const count = sessionsAnalytics.sessions_by_date[date];
      const dateObj = new Date(date);
      const label = dateObj.toLocaleDateString(undefined, { weekday: "short" });
      return {
        x: label,
        y: count,
      };
    });
  };

  const prepareStatusChartData = () => {
    if (!systemStats) return [];
    return [
      {
        label: "Active",
        value: systemStats.active_sessions || 0,
        color: auroraTheme.colors.success[500],
      },
      {
        label: "Idle",
        value:
          (systemStats.total_sessions || 0) -
          (systemStats.active_sessions || 0),
        color: auroraTheme.colors.neutral[400],
      },
    ];
  };

  const handleAutoFix = async (issue: any) => {
    try {
      setRefreshing(true);
      const result = await attemptAutoFixDiagnosis({
        error_type: issue.error_type || issue.title || "Exception",
        error_message: issue.error_message || issue.description || "Unknown error",
        context: {
          issue_id: issue.id,
          source: "admin_dashboard",
        },
      });

      if (result.fixed) {
        Alert.alert("Success", "Issue has been automatically resolved.");
        await loadDashboardData(true);
      } else {
        Alert.alert(
          "Failed",
          result.fix_result ||
            result.message ||
            "Could not auto-fix this issue. Please check logs.",
        );
      }
    } catch (error) {
      console.error("Auto-fix error:", error);
      Alert.alert("Error", "An error occurred while trying to fix the issue.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleServiceToggle = async (
    serviceKey: "backend" | "frontend",
    service: any,
  ) => {
    try {
      setServiceActionLoading(serviceKey);
      const response = service?.running
        ? await stopService(serviceKey)
        : await startService(serviceKey);
      Alert.alert(
        "Success",
        response?.message ||
          `${serviceKey} ${service?.running ? "stop" : "start"} request sent.`,
      );
      await loadDashboardData(true);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ||
          `Failed to ${service?.running ? "stop" : "start"} ${serviceKey}.`,
      );
    } finally {
      setServiceActionLoading(null);
    }
  };

  const adminTools = [
    {
      key: "monitoring",
      title: "Monitoring",
      subtitle: "Service controls and system metrics",
      icon: "pulse" as const,
      onPress: () => setActiveTab("monitoring"),
    },
    {
      key: "reports",
      title: "Reports",
      subtitle: "Generate exports and audit output",
      icon: "document-text" as const,
      onPress: () => setActiveTab("reports"),
    },
    {
      key: "users",
      title: "Users",
      subtitle: "Manage access, roles, and status",
      icon: "people" as const,
      onPress: () => router.push("/admin/users" as any),
    },
    {
      key: "settings",
      title: "Settings",
      subtitle: "System parameters and platform defaults",
      icon: "settings" as const,
      onPress: () => router.push("/admin/settings" as any),
    },
    {
      key: "logs",
      title: "Logs",
      subtitle: "Inspect backend and service output",
      icon: "journal" as const,
      onPress: () => router.push("/admin/logs" as any),
    },
    {
      key: "security",
      title: "Security",
      subtitle: "Review admin activity and risk signals",
      icon: "shield-checkmark" as const,
      onPress: () => router.push("/admin/security" as any),
    },
    {
      key: "sql-config",
      title: "SQL Config",
      subtitle: "Connection tools and SQL visibility",
      icon: "server" as const,
      onPress: () => router.push("/admin/sql-config" as any),
    },
    {
      key: "live-view",
      title: "Live View",
      subtitle: "Realtime admin monitoring surface",
      icon: "eye" as const,
      onPress: () => router.push("/admin/realtime-dashboard" as any),
    },
    {
      key: "user-workflows",
      title: "User Workflows",
      subtitle: "See current workflow state by operator",
      icon: "git-network" as const,
      onPress: () => router.push("/supervisor/user-workflows" as any),
    },
  ];

  const renderDiagnosis = () => (
    <DashboardDiagnosisPanel
      diagnosisHealth={diagnosisHealth}
      onAutoFix={handleAutoFix}
      styles={styles}
    />
  );

  const renderOverview = () => (
    <DashboardOverviewPanel
      adminTools={adminTools}
      healthScore={healthScore}
      issues={issues}
      servicesStatus={servicesStatus}
      sessionChartData={prepareSessionChartData()}
      statusChartData={prepareStatusChartData()}
      styles={styles}
      systemStats={systemStats}
    />
  );

  const renderMonitoring = () => (
    <DashboardMonitoringPanel
      metrics={metrics}
      onServiceToggle={handleServiceToggle}
      serviceActionLoading={serviceActionLoading}
      servicesStatus={servicesStatus}
      styles={styles}
    />
  );

  const renderReports = () => (
    <DashboardReportsPanel
      onOpenReport={(reportId) => {
        setSelectedReport(reportId);
        setShowReportModal(true);
      }}
      reports={reports}
      reportsLoading={reportsLoading}
      styles={styles}
    />
  );

  const renderAnalytics = () => (
    <DashboardAnalyticsPanel
      analyticsDateRange={analyticsDateRange}
      onChangeDateRange={setAnalyticsDateRange}
      sessionChartData={prepareSessionChartData()}
      styles={styles}
    />
  );

  return (
    <ScreenContainer
      backgroundType="aurora"
      auroraVariant="primary"
      auroraIntensity="medium"
      header={{
        title: "Admin Dashboard",
        subtitle: "System Overview & Controls",
        showLogoutButton: true,
        showBackButton: false,
        rightAction: {
          icon: refreshing ? "sync" : "refresh",
          onPress: () => loadDashboardData(true),
        },
      }}
      loading={loading}
      loadingText="Loading Dashboard..."
      noPadding
    >
      <View style={styles.container}>
        <DashboardTabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          styles={styles}
          tabs={DASHBOARD_TABS}
        />

        {/* Content Area */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadDashboardData(true)}
              tintColor={auroraTheme.colors.primary[500]}
            />
          }
        >
          {activeTab === "overview" && renderOverview()}
          {activeTab === "monitoring" && renderMonitoring()}
          {activeTab === "reports" && renderReports()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "diagnosis" && renderDiagnosis()}
        </ScrollView>

        <DashboardReportModal
          generating={generating}
          onClose={() => setShowReportModal(false)}
          onConfirm={() => {
            if (selectedReport) {
              handleGenerateReport(selectedReport);
            }
          }}
          onReportDateRangeChange={setReportDateRange}
          onReportFormatChange={setReportFormat}
          reportDateRange={reportDateRange}
          reportFormat={reportFormat}
          selectedReport={selectedReport}
          styles={styles}
          visible={showReportModal}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    ...typography.body,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
  },
  headerSubtitle: {
    ...typography.body,
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  refreshButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: auroraTheme.glass.medium.backgroundColor as string,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: auroraTheme.colors.border.light,
    gap: 24,
  },
  tab: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: auroraTheme.colors.primary[400],
  },
  tabText: {
    ...typography.body,
    fontSize: 16,
  },
  activeTabText: {
    ...typography.bodyStrong,
    color: auroraTheme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 24,
  },
  quickStatsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  toolCardWrapper: {
    flex: 1,
    minWidth: 210,
  },
  toolCardPressable: {
    flex: 1,
  },
  toolCard: {
    minHeight: 144,
    padding: 18,
    gap: 10,
  },
  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: auroraTheme.colors.primary[500] + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  toolTitle: {
    ...typography.bodyStrong,
    fontSize: 16,
  },
  toolSubtitle: {
    ...typography.small,
    lineHeight: 18,
  },
  quickStatCard: {
    flex: 1,
    minWidth: 140,
    padding: 20,
    alignItems: "center",
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: auroraTheme.colors.primary[500] + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickStatValue: {
    ...typography.h2,
    marginBottom: 4,
  },
  quickStatLabel: {
    ...typography.small,
  },
  chartsRow: {
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
  },
  chartCard: {
    flex: 1,
    minWidth: 300,
    padding: 20,
    minHeight: 300,
  },
  chartTitle: {
    ...typography.h3,
    fontSize: 18,
    marginBottom: 24,
  },
  sectionCard: {
    padding: 0,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    padding: 20,
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: auroraTheme.colors.border.light,
  },
  serviceInfo: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  serviceName: {
    ...typography.bodyStrong,
  },
  serviceDetails: {
    flex: 2,
  },
  serviceDetailText: {
    ...typography.small,
  },
  serviceStatusBadge: {
    flex: 1,
    alignItems: "flex-end",
  },
  serviceActions: {
    flex: 1,
    alignItems: "flex-end",
    gap: 10,
  },
  serviceStatusText: {
    ...typography.label,
    fontSize: 12,
  },
  serviceActionButton: {
    minWidth: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  serviceActionButtonSuccess: {
    backgroundColor: auroraTheme.colors.success[500],
  },
  serviceActionButtonDanger: {
    backgroundColor: auroraTheme.colors.error[500],
  },
  serviceActionText: {
    ...typography.label,
    color: "#fff",
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  metricCard: {
    flex: 1,
    padding: 20,
    minWidth: 150,
  },
  metricLabel: {
    ...typography.small,
    marginBottom: 8,
  },
  metricValue: {
    ...typography.h2,
    fontSize: 24,
  },
  diagnosisCard: {
    padding: 20,
  },
  diagnosisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionSubtitle: {
    ...typography.small,
    color: auroraTheme.colors.text.secondary,
    marginTop: 4,
  },
  healthBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: auroraTheme.colors.primary[500] + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: auroraTheme.colors.primary[500],
  },
  healthScoreText: {
    ...typography.h3,
    color: auroraTheme.colors.primary[400],
  },
  diagnosisStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    marginBottom: 24,
  },
  diagStatItem: {
    alignItems: "center",
  },
  diagStatValue: {
    ...typography.h2,
    fontSize: 28,
  },
  diagStatLabel: {
    ...typography.small,
    marginTop: 4,
  },
  issuesList: {
    gap: 12,
  },
  issueRow: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    alignItems: "center",
    gap: 16,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  issueInfo: {
    flex: 1,
  },
  issueTitle: {
    ...typography.bodyStrong,
    fontSize: 16,
  },
  issueDesc: {
    ...typography.small,
    color: auroraTheme.colors.text.secondary,
    marginTop: 2,
  },
  autoFixButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: auroraTheme.colors.primary[500] + "20",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  autoFixText: {
    ...typography.label,
    color: auroraTheme.colors.primary[400],
    fontSize: 11,
  },
  issueTime: {
    alignItems: "flex-end",
  },
  timeText: {
    ...typography.small,
    fontSize: 10,
    color: auroraTheme.colors.text.secondary,
  },
  noIssues: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 16,
  },
  noIssuesText: {
    ...typography.body,
    color: auroraTheme.colors.text.secondary,
  },
  recommendationsCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    gap: 10,
  },
  recommendationsTitle: {
    ...typography.bodyStrong,
    fontSize: 16,
  },
  recommendationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  recommendationText: {
    ...typography.small,
    flex: 1,
    color: auroraTheme.colors.text.secondary,
  },
  reportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  reportCard: {
    flex: 1,
    minWidth: 300,
    padding: 20,
  },
  reportHeader: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: auroraTheme.colors.primary[500] + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 4,
  },
  reportDesc: {
    ...typography.small,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: auroraTheme.colors.primary[500],
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  analyticsCard: {
    padding: 20,
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: Math.min(SCREEN_WIDTH * 0.9, 500),
    borderRadius: 24,
    padding: 0,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: auroraTheme.colors.border.light,
  },
  modalTitle: {
    ...typography.h3,
    fontSize: 20,
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    ...typography.label,
    marginTop: 16,
    marginBottom: 8,
  },
  formatOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  formatOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: auroraTheme.colors.border.light,
    backgroundColor: auroraTheme.colors.background.tertiary,
  },
  formatOptionActive: {
    backgroundColor: auroraTheme.colors.primary[500],
    borderColor: auroraTheme.colors.primary[500],
  },
  formatText: {
    color: "#FFF",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: auroraTheme.colors.border.light,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: auroraTheme.colors.border.light,
  },
  cancelButtonText: {
    color: auroraTheme.colors.text.secondary,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: auroraTheme.colors.primary[500],
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
