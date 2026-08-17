"""
Articles API endpoints — view articles, explanations, topics.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.article import ArticleBrief, ArticleExplanationResponse, ArticleDetailedResponse, TopicResponse
from app.services.content_service import (
    get_article_by_id, get_article_by_number, get_all_articles,
    get_article_explanation, get_all_topics, get_articles_by_topic,
)

router = APIRouter()


@router.get("/", response_model=List[ArticleBrief])
async def list_articles(session: AsyncSession = Depends(get_session)):
    """List all constitutional articles (brief view)."""
    articles = await get_all_articles(session)
    return [
        ArticleBrief(
            article_id=a.article_id,
            article_number=a.article_number,
            article_title=a.article_title,
            part_name=a.part_name,
            keywords=a.keywords,
            simplified_text_en=a.simplified_text_en,
            simplified_text_hi=a.simplified_text_hi,
            simplified_text_hinglish=a.simplified_text_hinglish,
        )
        for a in articles
    ]


@router.get("/topics", response_model=List[TopicResponse])
async def list_topics(session: AsyncSession = Depends(get_session)):
    """List all constitutional topics/categories."""
    topics = await get_all_topics(session)
    return topics


@router.get("/by-number/{article_number}", response_model=ArticleDetailedResponse)
async def get_by_number(article_number: str, session: AsyncSession = Depends(get_session)):
    """Get an article by its number (e.g., '21', '19', 'Preamble')."""
    article = await get_article_by_number(session, article_number)
    if article is None:
        raise HTTPException(status_code=404, detail=f"Article {article_number} not found")
    return article


@router.get("/{article_id}", response_model=ArticleDetailedResponse)
async def get_article(article_id: int, session: AsyncSession = Depends(get_session)):
    """Get full article details by database ID."""
    article = await get_article_by_id(session, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/{article_id}/simplified", response_model=ArticleExplanationResponse)
async def get_simplified(
    article_id: int,
    lang: str = Query("en", pattern="^(en|hi|hinglish)$"),
    mode: str = Query("simple", pattern="^(simple|student|detailed)$"),
    session: AsyncSession = Depends(get_session),
):
    """Get article explanation at the specified language and complexity level."""
    result = await get_article_explanation(session, article_id, lang, mode)
    if result is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return result


@router.get("/topic/{topic_category}", response_model=List[ArticleBrief])
async def get_by_topic(topic_category: str, session: AsyncSession = Depends(get_session)):
    """Get articles belonging to a topic category."""
    articles = await get_articles_by_topic(session, topic_category)
    return [
        ArticleBrief(
            article_id=a.article_id,
            article_number=a.article_number,
            article_title=a.article_title,
            part_name=a.part_name,
            keywords=a.keywords,
            simplified_text_en=a.simplified_text_en,
            simplified_text_hi=a.simplified_text_hi,
            simplified_text_hinglish=a.simplified_text_hinglish,
        )
        for a in articles
    ]
