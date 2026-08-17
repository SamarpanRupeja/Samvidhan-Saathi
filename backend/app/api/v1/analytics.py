"""
Analytics API endpoints — event tracking and popular content.
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import get_current_user_id
from app.models.article import ConstitutionalArticle
from app.services.user_service import log_activity

router = APIRouter()


@router.post("/track-event")
async def track_event(
    event_type: str,
    event_data: dict = {},
    user_id: Optional[str] = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Track a user event for analytics."""
    if user_id:
        await log_activity(session, user_id, event_type, event_data)
    return {"status": "tracked"}


@router.get("/popular-topics")
async def popular_topics(session: AsyncSession = Depends(get_session)):
    """Get most viewed/popular topics."""
    # For MVP, return articles sorted by part
    result = await session.execute(
        select(
            ConstitutionalArticle.part_name,
            func.count(ConstitutionalArticle.article_id).label("article_count"),
        )
        .group_by(ConstitutionalArticle.part_name)
        .order_by(func.count(ConstitutionalArticle.article_id).desc())
    )
    topics = [
        {"topic": row[0] or "Other", "article_count": row[1]}
        for row in result.all()
    ]
    return {"popular_topics": topics}
