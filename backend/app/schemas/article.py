"""
Article-related Pydantic schemas.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ArticleBrief(BaseModel):
    article_id: int
    article_number: str
    article_title: str
    part_name: Optional[str] = None
    keywords: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ArticleExplanationResponse(BaseModel):
    article_id: int
    article_number: str
    article_title: str
    part_number: Optional[int] = None
    part_name: Optional[str] = None
    explanation: str
    original_text: str
    language: str
    mode: str
    related_articles: Optional[List[int]] = None
    keywords: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ArticleDetailedResponse(BaseModel):
    article_id: int
    article_number: str
    article_title: str
    part_number: Optional[int] = None
    part_name: Optional[str] = None
    original_text: str
    simplified_text_en: Optional[str] = None
    simplified_text_hi: Optional[str] = None
    simplified_text_hinglish: Optional[str] = None
    student_text_en: Optional[str] = None
    student_text_hi: Optional[str] = None
    detailed_text: Optional[str] = None
    related_articles: Optional[List[int]] = None
    keywords: Optional[List[str]] = None
    last_amendment_number: Optional[int] = None

    class Config:
        from_attributes = True


class TopicResponse(BaseModel):
    topic_id: int
    topic_name_en: str
    topic_name_hi: Optional[str] = None
    topic_category: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    related_articles: Optional[List[int]] = None

    class Config:
        from_attributes = True


class LandmarkCaseResponse(BaseModel):
    case_id: int
    case_name: str
    citation: Optional[str] = None
    year: Optional[int] = None
    court: Optional[str] = None
    summary_en: Optional[str] = None
    summary_hi: Optional[str] = None
    constitutional_significance: Optional[str] = None
    related_articles: Optional[List[int]] = None

    class Config:
        from_attributes = True


class FAQResponse(BaseModel):
    faq_id: int
    question_en: str
    question_hi: Optional[str] = None
    answer_en: str
    answer_hi: Optional[str] = None
    related_article_id: Optional[int] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True


class MythResponse(BaseModel):
    myth_id: int
    myth_statement_en: str
    myth_statement_hi: Optional[str] = None
    reality_en: str
    reality_hi: Optional[str] = None
    related_article_id: Optional[int] = None

    class Config:
        from_attributes = True
