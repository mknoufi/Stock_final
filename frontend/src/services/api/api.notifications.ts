import api from "../httpClient";

export interface Notification {
  _id: string;
  id?: string;
  type: string;
  title: string;
  message: string;
  priority?: string;
  action_url?: string | null;
  read: boolean;
  created_at: string;
  read_at?: string | null;
}

type NotificationListResponse = {
  notifications: Notification[];
  total: number;
  unread_count: number;
};

export const getNotifications = async (
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<Notification[]> => {
  const response = await api.get<NotificationListResponse>("/api/notifications", {
    params: { unread_only: unreadOnly, limit },
  });
  return response.data.notifications || [];
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<{ unread_count: number }>("/api/notifications/unread-count");
  return response.data.unread_count ?? 0;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api.post(`/api/notifications/${encodeURIComponent(notificationId)}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.post("/api/notifications/mark-all-read");
};

