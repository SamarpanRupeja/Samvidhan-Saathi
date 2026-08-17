"""
Gamification-related Pydantic schemas.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BadgeResponse(BaseModel):
    badge_id: int
    badge_type: str
    badge_name: str
    badge_description: Optional[str] = None
    badge_icon: Optional[str] = None
    earned_at: datetime

    class Config:
        from_attributes = True


class PointsSummary(BaseModel):
    total_points: int
    streak_days: int
    badges_count: int
    scenarios_completed: int
    articles_read: int


class LeaderboardEntry(BaseModel):
    rank: int
    user_name: str
    total_points: int
    badges_count: int


class LeaderboardResponse(BaseModel):
    period: str  # "daily", "weekly", "all_time"
    entries: List[LeaderboardEntry]
    user_rank: Optional[int] = None


# Available badges definition
AVAILABLE_BADGES = {
    "first_search": {
        "name": "Explorer",
        "description": "Performed your first constitutional search",
        "icon": "🔍",
    },
    "first_scenario": {
        "name": "Scenario Starter",
        "description": "Completed your first interactive scenario",
        "icon": "🎭",
    },
    "rights_guardian": {
        "name": "Rights Guardian",
        "description": "Learned about all 6 Fundamental Rights",
        "icon": "🛡️",
    },
    "streak_7": {
        "name": "Week Warrior",
        "description": "7-day learning streak",
        "icon": "🔥",
    },
    "points_500": {
        "name": "Constitution Scholar",
        "description": "Earned 500 points",
        "icon": "📚",
    },
    "perfect_scenario": {
        "name": "Perfect Score",
        "description": "Got a scenario right on the first try",
        "icon": "⭐",
    },
    "ai_explorer": {
        "name": "AI Explorer",
        "description": "Asked 10 questions to the AI assistant",
        "icon": "🤖",
    },
    "multilingual": {
        "name": "Multilingual Learner",
        "description": "Used the app in multiple languages",
        "icon": "🌐",
    },
    "duty_champion": {
        "name": "Duty Champion",
        "description": "Learned about all Fundamental Duties",
        "icon": "🏅",
    },
    "preamble_master": {
        "name": "Preamble Master",
        "description": "Understood the complete Preamble",
        "icon": "🏛️",
    },
}
