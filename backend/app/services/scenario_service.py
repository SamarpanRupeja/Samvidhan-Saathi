"""
Scenario service — handles interactive constitutional scenarios.
"""

from typing import List, Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scenario import Scenario


async def get_all_scenarios(session: AsyncSession, topic_id: int = None,
                             difficulty: int = None) -> List[Scenario]:
    """Get scenarios, optionally filtered by topic or difficulty."""
    query = select(Scenario).where(Scenario.is_verified == True)

    if topic_id:
        query = query.where(Scenario.topic_id == topic_id)
    if difficulty:
        query = query.where(Scenario.difficulty_level == difficulty)

    query = query.order_by(Scenario.scenario_id)
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_scenario_by_id(session: AsyncSession, scenario_id: int) -> Optional[Scenario]:
    """Get a single scenario by ID."""
    result = await session.execute(
        select(Scenario).where(Scenario.scenario_id == scenario_id)
    )
    return result.scalar_one_or_none()


async def get_daily_scenario(session: AsyncSession) -> Optional[Scenario]:
    """Get a random scenario for the daily challenge."""
    result = await session.execute(
        select(Scenario).where(Scenario.is_verified == True).order_by(func.random()).limit(1)
    )
    return result.scalar_one_or_none()


def evaluate_answer(scenario: Scenario, selected_option: str) -> dict:
    """Evaluate a user's answer to a scenario."""
    options = scenario.options if isinstance(scenario.options, list) else []

    correct_option = None
    selected_feedback = "Invalid option selected."
    is_correct = False

    for opt in options:
        if opt.get("is_correct"):
            correct_option = opt["option"]
        if opt["option"] == selected_option:
            is_correct = opt.get("is_correct", False)
            selected_feedback = opt.get("feedback", "")

    return {
        "is_correct": is_correct,
        "selected_option": selected_option,
        "correct_option": correct_option or "B",
        "feedback": selected_feedback,
        "explanation_en": scenario.explanation_en,
        "explanation_hi": scenario.explanation_hi,
        "related_case_law": scenario.related_case_law,
        "points_earned": scenario.points_value if is_correct else 0,
        "related_articles": scenario.related_articles or [],
    }
