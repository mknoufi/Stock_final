"""
Notification Service - Push and in-app notifications

Supports:
- Recount assignments
- Approval decisions
- Session reminders
- System alerts
"""

import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class NotificationType(str, Enum):
    """Types of notifications"""

    RECOUNT_ASSIGNED = "recount_assigned"
    COUNT_APPROVED = "count_approved"
    COUNT_REJECTED = "count_rejected"
    SESSION_REMINDER = "session_reminder"
    VARIANCE_ALERT = "variance_alert"
    SYSTEM_ALERT = "system_alert"


class NotificationPriority(str, Enum):
    """Notification priority levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class NotificationService:
    """Service for managing notifications"""

    def __init__(self, db):
        self.db = db

    async def create_notification(
        self,
        user_id: str,
        notification_type: NotificationType,
        title: str,
        message: str,
        priority: NotificationPriority = NotificationPriority.MEDIUM,
        action_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Create a new notification.

        Args:
            user_id: Target user ID
            notification_type: Type of notification
            title: Notification title
            message: Notification message
            priority: Priority level
            action_url: Optional URL for action
            metadata: Optional additional data

        Returns:
            Notification ID
        """
        notification = {
            "user_id": user_id,
            "type": notification_type.value,
            "title": title,
            "message": message,
            "priority": priority.value,
            "action_url": action_url,
            "metadata": metadata or {},
            "read": False,
            "created_at": datetime.now(timezone.utc).replace(tzinfo=None),
            "read_at": None,
        }

        result = await self.db.notifications.insert_one(notification)
        notification_id = str(result.inserted_id)

        logger.info(f"Created notification {notification_id} for user {user_id}: {title}")

        # TODO: Send push notification if user has enabled it
        # await self._send_push_notification(user_id, notification)

        return notification_id

    async def notify_recount_assigned(
        self, user_id: str, count_line_id: str, item_name: str, reason: str, assigned_by: str
    ) -> str:
        """Notify user of recount assignment"""
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.RECOUNT_ASSIGNED,
            title="Recount Requested",
            message=f"Please recount '{item_name}'. Reason: {reason}",
            priority=NotificationPriority.HIGH,
            action_url=f"/count-lines/{count_line_id}",
            metadata={
                "count_line_id": count_line_id,
                "item_name": item_name,
                "reason": reason,
                "assigned_by": assigned_by,
            },
        )

    async def notify_count_approved(
        self, user_id: str, count_line_id: str, item_name: str, approved_by: str
    ) -> str:
        """Notify user that their count was approved"""
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.COUNT_APPROVED,
            title="Count Approved",
            message=f"Your count for '{item_name}' has been approved",
            priority=NotificationPriority.MEDIUM,
            action_url=f"/count-lines/{count_line_id}",
            metadata={
                "count_line_id": count_line_id,
                "item_name": item_name,
                "approved_by": approved_by,
            },
        )

    async def notify_count_rejected(
        self, user_id: str, count_line_id: str, item_name: str, reason: str, rejected_by: str
    ) -> str:
        """Notify user that their count was rejected"""
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.COUNT_REJECTED,
            title="Count Rejected",
            message=f"Your count for '{item_name}' was rejected. Reason: {reason}",
            priority=NotificationPriority.HIGH,
            action_url=f"/count-lines/{count_line_id}",
            metadata={
                "count_line_id": count_line_id,
                "item_name": item_name,
                "reason": reason,
                "rejected_by": rejected_by,
            },
        )

    async def get_user_notifications(
        self, user_id: str, unread_only: bool = False, limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get notifications for a user"""
        query: Dict[str, Any] = {"user_id": user_id}
        if unread_only:
            query["read"] = False

        notifications = (
            await self.db.notifications.find(query)
            .sort("created_at", -1)
            .limit(limit)
            .to_list(limit)
        )

        # Convert ObjectId to string
        for notif in notifications:
            notif["_id"] = str(notif["_id"])

        return notifications

    async def mark_as_read(self, notification_id: str, user_id: str) -> bool:
        """Mark notification as read"""
        from bson import ObjectId

        result = await self.db.notifications.update_one(
            {"_id": ObjectId(notification_id), "user_id": user_id},
            {"$set": {"read": True, "read_at": datetime.now(timezone.utc).replace(tzinfo=None)}},
        )

        return result.modified_count > 0

    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all notifications as read for a user"""
        result = await self.db.notifications.update_many(
            {"user_id": user_id, "read": False},
            {"$set": {"read": True, "read_at": datetime.now(timezone.utc).replace(tzinfo=None)}},
        )

        return result.modified_count

    async def delete_notification(self, notification_id: str, user_id: str) -> bool:
        """Delete a notification"""
        from bson import ObjectId

        result = await self.db.notifications.delete_one(
            {"_id": ObjectId(notification_id), "user_id": user_id}
        )

        return result.deleted_count > 0

    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications"""
        return await self.db.notifications.count_documents({"user_id": user_id, "read": False})

    async def _send_push_notification(self, user_id: str, notification: Dict[str, Any]):
        """Send push notification (placeholder for future implementation)"""
        # TODO: Integrate with Firebase Cloud Messaging or similar
        logger.info(f"Push notification would be sent to {user_id}: {notification['title']}")
        pass
