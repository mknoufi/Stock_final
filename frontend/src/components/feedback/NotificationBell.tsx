/**
 * NotificationBell Component - Shows notification bell with unread count badge
 * Part of FR-M-23: Recount notifications
 */
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNotificationStore, startNotificationPolling, stopNotificationPolling } from "../../store/notificationStore";

interface NotificationBellProps {
  size?: number;
  color?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  size = 22,
  color = "#1E293B",
}) => {
  const router = useRouter();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Start polling for notification updates
    startNotificationPolling(30000); // Poll every 30 seconds

    // Initial fetch
    fetchUnreadCount();

    return () => {
      stopNotificationPolling();
    };
  }, [fetchUnreadCount]);

  const handlePress = () => {
    router.push("/notifications" as any);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      accessibilityHint={`You have ${unreadCount} unread notifications`}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
