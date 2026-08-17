"""
AI-related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class AIAskRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=2000)
    language: str = Field(default="en", pattern="^(en|hi|hinglish)$")
    mode: str = Field(default="simple", pattern="^(simple|student|detailed)$")


class SourceCitation(BaseModel):
    type: str  # "constitutional_article", "landmark_case", "faq"
    reference: str  # e.g., "Article 21"
    text_snippet: str
    article_id: Optional[int] = None


class AIAskResponse(BaseModel):
    answer: str
    confidence: float
    language: str
    sources: List[SourceCitation]
    related_articles: List[int] = []
    is_constitutional: bool = True
    non_constitutional_note: Optional[str] = None


class SituationClassifyRequest(BaseModel):
    situation: str = Field(..., min_length=5, max_length=2000)
    language: str = Field(default="en", pattern="^(en|hi|hinglish)$")


class SituationClassifyResponse(BaseModel):
    is_constitutional: bool
    category: str  # "fundamental_rights", "dpsp", "criminal_law", etc.
    confidence: float
    explanation: str
    relevant_articles: List[int] = []
