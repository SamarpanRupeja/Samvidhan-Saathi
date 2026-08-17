"""
Gamification service — points, badges, and leaderboards.
"""

from typing import List, Optional

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.gamification import UserBadge
from app.schemas.gamification import AVAILABLE_BADGES


async def get_user_badges(session: AsyncSession, user_id: str) -> List[UserBadge]:
    """Get all badges earned by a user."""
    result = await session.execute(
        select(UserBadge)
        .where(UserBadge.user_id == str(user_id))
        .order_by(UserBadge.earned_at.desc())
    )
    return list(result.scalars().all())


async def award_badge(session: AsyncSession, user_id: str, badge_type: str) -> Optional[UserBadge]:
    """Award a badge to a user (if not already earned)."""
    # Check if already earned
    existing = await session.execute(
        select(UserBadge).where(
            UserBadge.user_id == str(user_id),
            UserBadge.badge_type == badge_type,
        )
    )
    if existing.scalar_one_or_none():
        return None  # Already has badge

    badge_info = AVAILABLE_BADGES.get(badge_type)
    if not badge_info:
        return None

    badge = UserBadge(
        user_id=str(user_id),
        badge_type=badge_type,
        badge_name=badge_info["name"],
        badge_description=badge_info.get("description", ""),
        badge_icon=badge_info.get("icon", "🏅"),
    )
    session.add(badge)
    await session.flush()
    return badge


async def check_and_award_badges(session: AsyncSession, user_id: str, trigger: str, data: dict = None):
    """Check if user qualifies for any badges based on a trigger event."""
    user_result = await session.execute(
        select(User).where(User.user_id == str(user_id))
    )
    user = user_result.scalar_one_or_none()
    if not user:
        return []

    awarded = []

    if trigger == "search":
        badge = await award_badge(session, user_id, "first_search")
        if badge:
            awarded.append(badge)

    elif trigger == "scenario_complete":
        badge = await award_badge(session, user_id, "first_scenario")
        if badge:
            awarded.append(badge)
        if data and data.get("is_correct"):
            badge = await award_badge(session, user_id, "perfect_scenario")
            if badge:
                awarded.append(badge)

    elif trigger == "ai_query":
        badge = await award_badge(session, user_id, "ai_explorer")
        if badge:
            awarded.append(badge)

    # Points-based badges
    if user.total_points and user.total_points >= 500:
        badge = await award_badge(session, user_id, "points_500")
        if badge:
            awarded.append(badge)

    return awarded


async def get_leaderboard(session: AsyncSession, limit: int = 10) -> List[dict]:
    """Get the top users by points."""
    result = await session.execute(
        select(User)
        .order_by(desc(User.total_points))
        .limit(limit)
    )
    users = list(result.scalars().all())

    # Count badges for each user
    leaderboard = []
    for rank, user in enumerate(users, 1):
        badge_count_result = await session.execute(
            select(func.count(UserBadge.badge_id))
            .where(UserBadge.user_id == user.user_id)
        )
        badge_count = badge_count_result.scalar() or 0

        leaderboard.append({
            "rank": rank,
            "user_name": user.name,
            "total_points": user.total_points or 0,
            "badges_count": badge_count,
        })

    return leaderboard


async def get_points_summary(session: AsyncSession, user_id: str) -> dict:
    """Get a summary of user's gamification stats."""
    user_result = await session.execute(
        select(User).where(User.user_id == str(user_id))
    )
    user = user_result.scalar_one_or_none()
    if not user:
        return {"total_points": 0, "streak_days": 0, "badges_count": 0, "scenarios_completed": 0, "articles_read": 0}

    badge_count_result = await session.execute(
        select(func.count(UserBadge.badge_id)).where(UserBadge.user_id == str(user_id))
    )
    badges_count = badge_count_result.scalar() or 0

    return {
        "total_points": user.total_points or 0,
        "streak_days": user.streak_days or 0,
        "badges_count": badges_count,
        "scenarios_completed": 0,
        "articles_read": 0,
    }
