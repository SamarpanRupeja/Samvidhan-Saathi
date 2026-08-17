"""
Scenarios API endpoints — interactive constitutional learning.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import get_current_user_id
from app.schemas.scenario import ScenarioBrief, ScenarioFullResponse, ScenarioSubmitRequest, ScenarioSubmitResponse
from app.services.scenario_service import get_all_scenarios, get_scenario_by_id, get_daily_scenario, evaluate_answer
from app.services.user_service import add_points, log_activity
from app.services.gamification_service import check_and_award_badges

router = APIRouter()


@router.get("/", response_model=List[ScenarioFullResponse])
async def list_scenarios(
    topic_id: Optional[int] = Query(None),
    difficulty: Optional[int] = Query(None, ge=1, le=5),
    session: AsyncSession = Depends(get_session),
):
    """List all scenarios with descriptions and options (answers hidden)."""
    scenarios = await get_all_scenarios(session, topic_id=topic_id, difficulty=difficulty)
    result = []
    for s in scenarios:
        safe_options = [
            {"option": opt["option"], "text": opt["text"], "is_correct": False, "feedback": ""}
            for opt in (s.options if isinstance(s.options, list) else [])
        ]
        result.append(
            ScenarioFullResponse(
                scenario_id=s.scenario_id,
                scenario_title_en=s.scenario_title_en,
                scenario_title_hi=s.scenario_title_hi,
                scenario_description_en=s.scenario_description_en,
                scenario_description_hi=s.scenario_description_hi,
                difficulty_level=s.difficulty_level,
                primary_article_id=s.primary_article_id,
                related_articles=s.related_articles,
                options=safe_options,
                points_value=s.points_value,
                tags=s.tags,
            )
        )
    return result


@router.get("/daily", response_model=ScenarioFullResponse)
async def daily_scenario(session: AsyncSession = Depends(get_session)):
    """Get the daily scenario challenge."""
    scenario = await get_daily_scenario(session)
    if scenario is None:
        raise HTTPException(status_code=404, detail="No scenarios available")

    # Strip correct answer info from options for the response
    safe_options = [
        {"option": opt["option"], "text": opt["text"], "is_correct": False, "feedback": ""}
        for opt in (scenario.options if isinstance(scenario.options, list) else [])
    ]

    return ScenarioFullResponse(
        scenario_id=scenario.scenario_id,
        scenario_title_en=scenario.scenario_title_en,
        scenario_title_hi=scenario.scenario_title_hi,
        scenario_description_en=scenario.scenario_description_en,
        scenario_description_hi=scenario.scenario_description_hi,
        difficulty_level=scenario.difficulty_level,
        primary_article_id=scenario.primary_article_id,
        related_articles=scenario.related_articles,
        options=safe_options,
        points_value=scenario.points_value,
        tags=scenario.tags,
    )


@router.get("/{scenario_id}", response_model=ScenarioFullResponse)
async def get_scenario(scenario_id: int, session: AsyncSession = Depends(get_session)):
    """Get a specific scenario (without revealing correct answer)."""
    scenario = await get_scenario_by_id(session, scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")

    safe_options = [
        {"option": opt["option"], "text": opt["text"], "is_correct": False, "feedback": ""}
        for opt in (scenario.options if isinstance(scenario.options, list) else [])
    ]

    return ScenarioFullResponse(
        scenario_id=scenario.scenario_id,
        scenario_title_en=scenario.scenario_title_en,
        scenario_title_hi=scenario.scenario_title_hi,
        scenario_description_en=scenario.scenario_description_en,
        scenario_description_hi=scenario.scenario_description_hi,
        difficulty_level=scenario.difficulty_level,
        primary_article_id=scenario.primary_article_id,
        related_articles=scenario.related_articles,
        options=safe_options,
        points_value=scenario.points_value,
        tags=scenario.tags,
    )


@router.post("/{scenario_id}/submit", response_model=ScenarioSubmitResponse)
async def submit_answer(
    scenario_id: int,
    req: ScenarioSubmitRequest,
    session: AsyncSession = Depends(get_session),
    user_id: Optional[str] = Depends(get_current_user_id),
):
    """Submit an answer for a scenario and get feedback."""
    scenario = await get_scenario_by_id(session, scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")

    result = evaluate_answer(scenario, req.selected_option)

    # Award points and badges if user is authenticated
    if user_id and result["is_correct"]:
        await add_points(session, user_id, result["points_earned"])
        await check_and_award_badges(session, user_id, "scenario_complete", {"is_correct": True})
        await log_activity(session, user_id, "scenario_complete", {
            "scenario_id": scenario_id,
            "is_correct": True,
            "points": result["points_earned"],
        })

    return ScenarioSubmitResponse(**result)
