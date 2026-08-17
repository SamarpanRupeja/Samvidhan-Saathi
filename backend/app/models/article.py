"""
Constitutional content SQLAlchemy ORM models.
Compatible with both PostgreSQL (Supabase) and SQLite.
"""

from datetime import datetime, timezone, date

from sqlalchemy import String, Integer, DateTime, Date, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ConstitutionalArticle(Base):
    __tablename__ = "constitutional_articles"

    article_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    article_number: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    article_title: Mapped[str] = mapped_column(Text, nullable=False)
    part_number: Mapped[int] = mapped_column(Integer, nullable=True)
    part_name: Mapped[str] = mapped_column(String(100), nullable=True)
    original_text: Mapped[str] = mapped_column(Text, nullable=False)

    # Simplified explanations (3 tiers × 3 languages)
    simplified_text_en: Mapped[str] = mapped_column(Text, nullable=True)
    simplified_text_hi: Mapped[str] = mapped_column(Text, nullable=True)
    simplified_text_hinglish: Mapped[str] = mapped_column(Text, nullable=True)
    student_text_en: Mapped[str] = mapped_column(Text, nullable=True)
    student_text_hi: Mapped[str] = mapped_column(Text, nullable=True)
    detailed_text: Mapped[str] = mapped_column(Text, nullable=True)

    # Metadata
    last_amendment_number: Mapped[int] = mapped_column(Integer, nullable=True)
    last_amendment_date: Mapped[date] = mapped_column(Date, nullable=True)
    related_articles: Mapped[list] = mapped_column(JSON, nullable=True)
    keywords: Mapped[list] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Topic(Base):
    __tablename__ = "topics"

    topic_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    topic_name_hi: Mapped[str] = mapped_column(String(255), nullable=True)
    topic_category: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    icon_url: Mapped[str] = mapped_column(Text, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    related_articles: Mapped[list] = mapped_column(JSON, nullable=True)


class LandmarkCase(Base):
    __tablename__ = "landmark_cases"

    case_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_name: Mapped[str] = mapped_column(String(255), nullable=False)
    citation: Mapped[str] = mapped_column(String(100), nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=True)
    court: Mapped[str] = mapped_column(String(100), nullable=True)
    summary_en: Mapped[str] = mapped_column(Text, nullable=True)
    summary_hi: Mapped[str] = mapped_column(Text, nullable=True)
    constitutional_significance: Mapped[str] = mapped_column(Text, nullable=True)
    related_articles: Mapped[list] = mapped_column(JSON, nullable=True)
    case_url: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class FAQ(Base):
    __tablename__ = "faqs"

    faq_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_en: Mapped[str] = mapped_column(Text, nullable=False)
    question_hi: Mapped[str] = mapped_column(Text, nullable=True)
    answer_en: Mapped[str] = mapped_column(Text, nullable=False)
    answer_hi: Mapped[str] = mapped_column(Text, nullable=True)
    related_article_id: Mapped[int] = mapped_column(Integer, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Myth(Base):
    __tablename__ = "myths"

    myth_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    myth_statement_en: Mapped[str] = mapped_column(Text, nullable=False)
    myth_statement_hi: Mapped[str] = mapped_column(Text, nullable=True)
    reality_en: Mapped[str] = mapped_column(Text, nullable=False)
    reality_hi: Mapped[str] = mapped_column(Text, nullable=True)
    related_article_id: Mapped[int] = mapped_column(Integer, nullable=True)
    source_reference: Mapped[str] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
