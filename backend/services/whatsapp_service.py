"""
WhatsApp Service - Interface for sending messages via WhatsApp
Initial implementation as a logging mock for development and testing.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


class WhatsAppService:
    """
    Service for sending WhatsApp messages.
    Can be later extended with Twilio, Infobip, or other providers.
    """

    def __init__(self, config: Optional[dict] = None):
        self.config = config or {}
        self.provider = self.config.get("WHATSAPP_PROVIDER", "mock")

    async def send_otp(self, phone_number: str, otp: str) -> bool:
        """
        Send an OTP code to a phone number.

        Args:
            phone_number: Recipient's phone number in E.164 format
            otp: 6-digit OTP code

        Returns:
            bool: True if sent successfully (always True for mock)
        """
        message = f"Your Stock Verify verification code is: {otp}. It expires in 5 minutes."

        # In mock mode, we just log the message to the console
        # This is high-fidelity logging that imitates a provider response
        logger.info(
            f"\n--- [WHATSAPP MOCK] ---\n"
            f"TO: {phone_number}\n"
            f"MESSAGE: {message}\n"
            f"PROVIDER: {self.provider}\n"
            f"TIMESTAMP: {datetime.now(timezone.utc).replace(tzinfo=None).isoformat()}\n"
            f"-----------------------\n"
        )

        # Simulate external API call latency
        # (Optional: await asyncio.sleep(0.5))

        return True

    async def send_password_reset_confirmation(self, phone_number: str) -> bool:
        """Send a confirmation message after successful password reset"""
        message = "Your Stock Verify password has been successfully reset. If this wasn't you, please contact support immediately."

        logger.info(
            f"\n--- [WHATSAPP MOCK] ---\n"
            f"TO: {phone_number}\n"
            f"MESSAGE: {message}\n"
            f"-----------------------\n"
        )
        return True
