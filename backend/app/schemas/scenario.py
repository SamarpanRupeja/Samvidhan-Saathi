"""
Scenario-related Pydantic schemas.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ScenarioOption(BaseModel):
    option: str
    text: str
    is_correct: bool = False
    feedback: str = ""


class ScenarioBrief(BaseModel):
    scenario_id: int
    scenario_title_en: str
    scenario_title_hi: Optional[str] = None
    difficulty_level: int
    primary_article_id: Optional[int] = None
    points_value: int
    tags: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ScenarioFullResponse(BaseModel):
    scenario_id: int
    scenario_title_en: str
    scenario_title_hi: Optional[str] = None
    scenario_description_en: str
    scenario_description_hi: Optional[str] = None
    difficulty_level: int
    primary_article_id: Optional[int] = None
    related_articles: Optional[List[int]] = None
    options: List[ScenarioOption]
    points_value: int
    tags: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ScenarioSubmitRequest(BaseModel):
    selected_option: str


class ScenarioSubmitResponse(BaseModel):
    is_correct: bool
    selected_option: str
    correct_option: str
    feedback: str
    explanation_en: Optional[str] = None
    explanation_hi: Optional[str] = None
    related_case_law: Optional[str] = None
    points_earned: int
    related_articles: Optional[List[int]] = None
