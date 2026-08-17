"""
User-related SQLAlchemy ORM models.
Compatible with both PostgreSQL (Supabase) and SQLite.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Boolean, Integer, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str] = mapped_column(String(15), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    preferred_mode: Mapped[str] = mapped_column(String(20), default="simple")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    last_login: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    profile_picture_url: Mapped[str] = mapped_column(Text, nullable=True)
    total_points: Mapped[int] = mapped_column(Integer, default=0)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)


class UserProgress(Base):
    __tablename__ = "user_progress"

    progress_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    topic_id: Mapped[int] = mapped_column(Integer, nullable=False)
    completion_percentage: Mapped[int] = mapped_column(Integer, default=0)
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    last_accessed: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    quiz_score: Mapped[dict] = mapped_column(JSON, nullable=True)


class UserActivity(Base):
    __tablename__ = "user_activity"

    activity_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    activity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    activity_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
