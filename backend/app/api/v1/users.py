"""
User API endpoints — registration, login, profile, preferences.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import require_current_user_id
from app.schemas.user import (
    UserRegisterRequest, UserLoginRequest, UserLoginResponse,
    UserProfileResponse, UserPreferencesUpdate,
)
from app.services.user_service import (
    register_user, authenticate_user, create_user_token,
    get_user_by_id, update_user_preferences,
)

router = APIRouter()


@router.post("/register", response_model=UserLoginResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest, session: AsyncSession = Depends(get_session)):
    """Register a new user account."""
    try:
        user = await register_user(
            session, req.name, req.email, req.password,
            req.preferred_language, req.preferred_mode,
        )
        token = create_user_token(user)
        return UserLoginResponse(
            access_token=token,
            user=UserProfileResponse(
                user_id=str(user.user_id),
                name=user.name,
                email=user.email,
                preferred_language=user.preferred_language,
                preferred_mode=user.preferred_mode,
                total_points=user.total_points or 0,
                streak_days=user.streak_days or 0,
                created_at=user.created_at,
            ),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=UserLoginResponse)
async def login(req: UserLoginRequest, session: AsyncSession = Depends(get_session)):
    """Login with email and password."""
    user = await authenticate_user(session, req.email, req.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_user_token(user)
    return UserLoginResponse(
        access_token=token,
        user=UserProfileResponse(
            user_id=str(user.user_id),
            name=user.name,
            email=user.email,
            preferred_language=user.preferred_language,
            preferred_mode=user.preferred_mode,
            total_points=user.total_points or 0,
            streak_days=user.streak_days or 0,
            created_at=user.created_at,
        ),
    )


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(
    user_id: str = Depends(require_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get current user's profile."""
    user = await get_user_by_id(session, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfileResponse(
        user_id=str(user.user_id),
        name=user.name,
        email=user.email,
        preferred_language=user.preferred_language,
        preferred_mode=user.preferred_mode,
        total_points=user.total_points or 0,
        streak_days=user.streak_days or 0,
        created_at=user.created_at,
    )


@router.put("/preferences", response_model=UserProfileResponse)
async def update_preferences(
    req: UserPreferencesUpdate,
    user_id: str = Depends(require_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Update user preferences (language, mode, name)."""
    user = await update_user_preferences(
        session, user_id,
        preferred_language=req.preferred_language,
        preferred_mode=req.preferred_mode,
        name=req.name,
    )
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfileResponse(
        user_id=str(user.user_id),
        name=user.name,
        email=user.email,
        preferred_language=user.preferred_language,
        preferred_mode=user.preferred_mode,
        total_points=user.total_points or 0,
        streak_days=user.streak_days or 0,
        created_at=user.created_at,
    )
