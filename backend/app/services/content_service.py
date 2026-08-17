"""
Content service — serves constitutional articles, topics, FAQs, myths, and cases.
"""

from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.article import ConstitutionalArticle, Topic, LandmarkCase, FAQ, Myth


async def get_article_by_id(session: AsyncSession, article_id: int) -> Optional[ConstitutionalArticle]:
    """Get an article by its database ID."""
    result = await session.execute(
        select(ConstitutionalArticle).where(ConstitutionalArticle.article_id == article_id)
    )
    return result.scalar_one_or_none()


async def get_article_by_number(session: AsyncSession, article_number: str) -> Optional[ConstitutionalArticle]:
    """Get an article by its article number (e.g., '21', '19', 'Preamble')."""
    result = await session.execute(
        select(ConstitutionalArticle).where(ConstitutionalArticle.article_number == article_number)
    )
    return result.scalar_one_or_none()


async def get_all_articles(session: AsyncSession) -> List[ConstitutionalArticle]:
    """Get all constitutional articles."""
    result = await session.execute(
        select(ConstitutionalArticle).order_by(ConstitutionalArticle.article_id)
    )
    return list(result.scalars().all())


async def get_article_explanation(session: AsyncSession, article_id: int,
                                   language: str = "en", mode: str = "simple") -> Optional[dict]:
    """Get an article explanation based on language and mode."""
    article = await get_article_by_id(session, article_id)
    if article is None:
        return None

    # Select the appropriate explanation text
    if mode == "simple":
        explanation_map = {
            "en": article.simplified_text_en,
            "hi": article.simplified_text_hi,
            "hinglish": article.simplified_text_hinglish,
        }
    elif mode == "student":
        explanation_map = {
            "en": article.student_text_en,
            "hi": article.student_text_hi,
            "hinglish": article.student_text_en,  # fallback to English for student-hinglish
        }
    else:  # detailed
        explanation_map = {
            "en": article.detailed_text,
            "hi": article.detailed_text,  # fallback
            "hinglish": article.detailed_text,  # fallback
        }

    explanation = explanation_map.get(language, article.simplified_text_en) or article.simplified_text_en

    return {
        "article_id": article.article_id,
        "article_number": article.article_number,
        "article_title": article.article_title,
        "part_number": article.part_number,
        "part_name": article.part_name,
        "explanation": explanation,
        "original_text": article.original_text,
        "language": language,
        "mode": mode,
        "related_articles": article.related_articles or [],
        "keywords": article.keywords or [],
    }


async def get_all_topics(session: AsyncSession) -> List[Topic]:
    """Get all topics/categories."""
    result = await session.execute(
        select(Topic).order_by(Topic.display_order)
    )
    return list(result.scalars().all())


async def get_articles_by_topic(session: AsyncSession, topic_category: str) -> List[ConstitutionalArticle]:
    """Get articles belonging to a specific topic category."""
    # First get the topic
    topic_result = await session.execute(
        select(Topic).where(Topic.topic_category == topic_category)
    )
    topic = topic_result.scalar_one_or_none()

    if topic is None or not topic.related_articles:
        # Fallback: filter by part_name
        part_map = {
            "fundamental_rights": "Fundamental Rights",
            "dpsp": "Directive Principles of State Policy",
            "duties": "Fundamental Duties (Part IVA)",
            "emergency": "Emergency Provisions",
        }
        part_name = part_map.get(topic_category)
        if part_name:
            result = await session.execute(
                select(ConstitutionalArticle).where(
                    ConstitutionalArticle.part_name == part_name
                )
            )
            return list(result.scalars().all())
        return []

    result = await session.execute(
        select(ConstitutionalArticle).where(
            ConstitutionalArticle.article_id.in_(topic.related_articles)
        )
    )
    return list(result.scalars().all())
