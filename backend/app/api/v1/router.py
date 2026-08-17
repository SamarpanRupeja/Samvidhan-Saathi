"""
API v1 router — aggregates all sub-routers into one.
"""

from fastapi import APIRouter

from app.api.v1 import users, articles, search, ai, scenarios, gamification, analytics

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(articles.router, prefix="/articles", tags=["Articles"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Assistant"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(gamification.router, prefix="/gamification", tags=["Gamification"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
