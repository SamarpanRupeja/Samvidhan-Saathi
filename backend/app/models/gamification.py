"""
Gamification SQLAlchemy ORM model.
Compatible with both PostgreSQL (Supabase) and SQLite.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class UserBadge(Base):
    __tablename__ = "user_badges"

    badge_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    badge_type: Mapped[str] = mapped_column(String(50), nullable=False)
    badge_name: Mapped[str] = mapped_column(String(100), nullable=False)
    badge_description: Mapped[str] = mapped_column(String(255), nullable=True)
    badge_icon: Mapped[str] = mapped_column(String(10), nullable=True)  # emoji
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    badge_metadata: Mapped[dict] = mapped_column(JSON, nullable=True)
