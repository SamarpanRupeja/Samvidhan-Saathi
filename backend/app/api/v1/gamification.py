"""
Gamification API endpoints — points, badges, leaderboard.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import require_current_user_id
from app.schemas.gamification import BadgeResponse, PointsSummary, LeaderboardResponse, LeaderboardEntry, AVAILABLE_BADGES
from app.services.gamification_service import get_user_badges, get_points_summary, get_leaderboard

router = APIRouter()


@router.get("/points", response_model=PointsSummary)
async def get_points(
    user_id: str = Depends(require_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get current user's points and gamification summary."""
    summary = await get_points_summary(session, user_id)
    return PointsSummary(**summary)


@router.get("/badges", response_model=List[BadgeResponse])
async def get_badges(
    user_id: str = Depends(require_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get all badges earned by the current user."""
    badges = await get_user_badges(session, user_id)
    return badges


@router.get("/badges/available")
async def get_available_badges():
    """Get all available badges that can be earned."""
    return [
        {
            "badge_type": badge_type,
            "name": info["name"],
            "description": info["description"],
            "icon": info["icon"],
        }
        for badge_type, info in AVAILABLE_BADGES.items()
    ]


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def leaderboard(
    period: str = Query("all_time", pattern="^(daily|weekly|all_time)$"),
    session: AsyncSession = Depends(get_session),
):
    """Get the leaderboard (top users by points)."""
    entries = await get_leaderboard(session, limit=10)
    return LeaderboardResponse(
        period=period,
        entries=[LeaderboardEntry(**e) for e in entries],
    )
