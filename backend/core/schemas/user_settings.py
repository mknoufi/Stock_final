"""
User Settings Schema

Pydantic models for user-specific appearance settings.
"""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class UserSettings(BaseModel):
    """User settings stored in MongoDB user document."""

    theme: Literal["light", "dark"] = Field(
        default="light",
        description="UI theme mode: light or dark",
    )
    font_size: int = Field(
        default=16,
        ge=12,
        le=22,
        description="Preferred base font size in points",
    )
    font_style: Literal["system", "serif", "mono"] = Field(
        default="system",
        description="Preferred font family style",
    )
    updated_at: Optional[datetime] = Field(
        default=None, description="Timestamp of last settings update"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "theme": "dark",
                "font_size": 18,
                "font_style": "serif",
            }
        }
    )


class UserSettingsUpdate(BaseModel):
    """Partial update model for user settings."""

    theme: Optional[Literal["light", "dark"]] = Field(
        default=None,
        description="UI theme mode: light or dark",
    )
    font_size: Optional[int] = Field(
        default=None,
        ge=12,
        le=22,
        description="Preferred base font size in points",
    )
    font_style: Optional[Literal["system", "serif", "mono"]] = Field(
        default=None,
        description="Preferred font family style",
    )

    model_config = ConfigDict(
        json_schema_extra={"example": {"theme": "dark", "font_size": 18, "font_style": "mono"}}
    )


class UserSettingsResponse(BaseModel):
    """Response model for user settings endpoints."""

    status: str = Field(default="success", description="Response status")
    message: str = Field(default="", description="Human-readable message")
    data: UserSettings = Field(description="User settings")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "success",
                "message": "Settings retrieved successfully",
                "data": {
                    "theme": "dark",
                    "font_size": 16,
                    "font_style": "system",
                },
            }
        }
    )
