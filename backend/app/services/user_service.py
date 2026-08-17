"""
User service — handles registration, login, profile, and preferences.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserProgress, UserActivity
from app.core.security import hash_password, verify_password, create_access_token


async def register_user(session: AsyncSession, name: str, email: str, password: str,
                        preferred_language: str = "en", preferred_mode: str = "simple") -> User:
    """Register a new user."""
    # Check if email already exists
    existing = await session.execute(select(User).where(User.email == email))
    if existing.scalar_one_or_none():
        raise ValueError("Email already registered")

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        preferred_language=preferred_language,
        preferred_mode=preferred_mode,
    )
    session.add(user)
    await session.flush()
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(password, user.password_hash):
        return None

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await session.flush()
    return user


def create_user_token(user: User) -> str:
    """Create a JWT token for a user."""
    return create_access_token({"sub": str(user.user_id), "name": user.name})


async def get_user_by_id(session: AsyncSession, user_id: str) -> Optional[User]:
    """Get a user by their ID."""
    result = await session.execute(
        select(User).where(User.user_id == str(user_id))
    )
    return result.scalar_one_or_none()


async def update_user_preferences(session: AsyncSession, user_id: str,
                                   preferred_language: str = None,
                                   preferred_mode: str = None,
                                   name: str = None) -> Optional[User]:
    """Update user preferences."""
    user = await get_user_by_id(session, user_id)
    if user is None:
        return None

    if preferred_language:
        user.preferred_language = preferred_language
    if preferred_mode:
        user.preferred_mode = preferred_mode
    if name:
        user.name = name

    await session.flush()
    return user


async def add_points(session: AsyncSession, user_id: str, points: int):
    """Add points to a user's total."""
    user = await get_user_by_id(session, user_id)
    if user:
        user.total_points = (user.total_points or 0) + points
        await session.flush()


async def log_activity(session: AsyncSession, user_id: str, activity_type: str, activity_data: dict = None):
    """Log a user activity for analytics."""
    activity = UserActivity(
        user_id=str(user_id),
        activity_type=activity_type,
        activity_data=activity_data or {},
    )
    session.add(activity)
    await session.flush()
