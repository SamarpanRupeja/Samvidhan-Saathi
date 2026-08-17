"""
Search-related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    language: str = Field(default="en", pattern="^(en|hi|hinglish)$")
    mode: str = Field(default="simple", pattern="^(simple|student|detailed)$")
    top_k: int = Field(default=5, ge=1, le=20)


class SearchResultItem(BaseModel):
    article_id: int
    article_number: str
    article_title: str
    relevance_score: float
    snippet: str
    why_relevant: str
    part_name: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]
    total_results: int
    is_constitutional: bool = True
    non_constitutional_note: Optional[str] = None
