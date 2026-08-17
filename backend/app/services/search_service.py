"""
Search service — keyword and semantic search across constitutional articles.
Compatible with both PostgreSQL and SQLite.
"""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.article import ConstitutionalArticle


async def search_articles(session: AsyncSession, query: str, top_k: int = 5) -> List[dict]:
    """
    Search constitutional articles using keyword and semantic matching.
    """
    query_lower = query.lower().strip()
    query_words = [w for w in query_lower.split() if len(w) > 2]

    # Fetch all articles to rank in memory
    result = await session.execute(select(ConstitutionalArticle))
    articles = list(result.scalars().all())

    # Score and rank results
    scored_results = []
    for article in articles:
        score = _calculate_relevance(article, query_lower, query_words)
        if score > 0:
            scored_results.append({
                "article_id": article.article_id,
                "article_number": article.article_number,
                "article_title": article.article_title,
                "relevance_score": round(score, 2),
                "snippet": _get_snippet(article, query_lower),
                "why_relevant": _explain_relevance(article, query_words),
                "part_name": article.part_name,
            })

    # Sort by relevance score descending
    scored_results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return scored_results[:top_k]


def _calculate_relevance(article: ConstitutionalArticle, query: str, query_words: list) -> float:
    """Calculate a relevance score (0-1) for an article against a query."""
    score = 0.0

    # Title match (highest weight)
    title_lower = (article.article_title or "").lower()
    art_num = (article.article_number or "").lower()

    if query in title_lower or query == art_num or f"article {art_num}" in query or f"अनुच्छेद {art_num}" in query:
        score += 0.5
    else:
        title_word_matches = sum(1 for w in query_words if w in title_lower)
        if query_words:
            score += 0.25 * min(title_word_matches / len(query_words), 1.0)

    # Keywords match
    raw_keywords = article.keywords if isinstance(article.keywords, list) else []
    keywords = [str(k).lower() for k in raw_keywords]
    keyword_matches = sum(1 for w in query_words if any(w in k for k in keywords))
    if query_words:
        score += 0.35 * min(keyword_matches / len(query_words), 1.0)

    # Simplified text match
    content = (
        (article.simplified_text_en or "") + " " +
        (article.simplified_text_hi or "") + " " +
        (article.simplified_text_hinglish or "")
    ).lower()

    if query in content:
        score += 0.2
    else:
        content_word_matches = sum(1 for w in query_words if w in content)
        if query_words:
            score += 0.15 * min(content_word_matches / len(query_words), 1.0)

    # Original text match
    original = (article.original_text or "").lower()
    if query in original:
        score += 0.1

    return min(score, 1.0)


def _get_snippet(article: ConstitutionalArticle, query: str) -> str:
    """Get a relevant snippet from the article's simplified text."""
    text = article.simplified_text_en or article.original_text or ""
    if len(text) <= 150:
        return text

    lower_text = text.lower()
    idx = lower_text.find(query)
    if idx >= 0:
        start = max(0, idx - 50)
        end = min(len(text), idx + len(query) + 100)
        snippet = text[start:end]
        if start > 0:
            snippet = "..." + snippet
        if end < len(text):
            snippet = snippet + "..."
        return snippet

    return text[:150] + "..."


def _explain_relevance(article: ConstitutionalArticle, query_words: list) -> str:
    """Generate a brief explanation of why this article is relevant."""
    raw_keywords = article.keywords if isinstance(article.keywords, list) else []
    keywords = [str(k).lower() for k in raw_keywords]
    matched_keywords = [w for w in query_words if any(w in k for k in keywords)]

    if matched_keywords:
        return f"Matches keywords: {', '.join(matched_keywords)}. Part: {article.part_name or 'N/A'}"
    return f"Related to your query. Part: {article.part_name or 'N/A'}"
