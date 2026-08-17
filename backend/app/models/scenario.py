"""
Scenario SQLAlchemy ORM model.
Compatible with both PostgreSQL (Supabase) and SQLite.
"""

from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    scenario_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scenario_title_en: Mapped[str] = mapped_column(Text, nullable=False)
    scenario_title_hi: Mapped[str] = mapped_column(Text, nullable=True)
    scenario_description_en: Mapped[str] = mapped_column(Text, nullable=False)
    scenario_description_hi: Mapped[str] = mapped_column(Text, nullable=True)
    difficulty_level: Mapped[int] = mapped_column(Integer, default=1)
    primary_article_id: Mapped[int] = mapped_column(Integer, nullable=True)
    related_articles: Mapped[list] = mapped_column(JSON, nullable=True)
    topic_id: Mapped[int] = mapped_column(Integer, nullable=True)
    # options: list of {"option": "A", "text": "...", "is_correct": bool, "feedback": "..."}
    options: Mapped[dict] = mapped_column(JSON, nullable=False)
    explanation_en: Mapped[str] = mapped_column(Text, nullable=True)
    explanation_hi: Mapped[str] = mapped_column(Text, nullable=True)
    related_case_law: Mapped[str] = mapped_column(Text, nullable=True)
    points_value: Mapped[int] = mapped_column(Integer, default=50)
    tags: Mapped[list] = mapped_column(JSON, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
