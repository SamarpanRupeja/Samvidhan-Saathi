"""
User-related Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=6)
    preferred_language: str = Field(default="en", pattern="^(en|hi|hinglish)$")
    preferred_mode: str = Field(default="simple", pattern="^(simple|student|detailed)$")


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfileResponse"


class UserProfileResponse(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    preferred_language: str
    preferred_mode: str
    total_points: int = 0
    streak_days: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class UserPreferencesUpdate(BaseModel):
    preferred_language: Optional[str] = Field(None, pattern="^(en|hi|hinglish)$")
    preferred_mode: Optional[str] = Field(None, pattern="^(simple|student|detailed)$")
    name: Optional[str] = Field(None, min_length=2, max_length=255)


class UserProgressResponse(BaseModel):
    topic_id: int
    topic_name: str
    completion_percentage: int
    points_earned: int

    class Config:
        from_attributes = True
