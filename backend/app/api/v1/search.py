"""
Search API endpoints — situation-based and keyword search.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_articles

router = APIRouter()


@router.post("/", response_model=SearchResponse)
async def search(req: SearchRequest, session: AsyncSession = Depends(get_session)):
    """Search constitutional articles by query (keyword-based)."""
    results = await search_articles(session, req.query, top_k=req.top_k)
    return SearchResponse(
        query=req.query,
        results=results,
        total_results=len(results),
        is_constitutional=True,
    )


@router.post("/situation", response_model=SearchResponse)
async def search_situation(req: SearchRequest, session: AsyncSession = Depends(get_session)):
    """Situation-based search — describe your problem, find relevant rights."""
    results = await search_articles(session, req.query, top_k=req.top_k)

    is_constitutional = len(results) > 0
    note = None if is_constitutional else (
        "Your query may relate to ordinary law rather than constitutional provisions. "
        "Try describing a situation involving your fundamental rights."
    )

    return SearchResponse(
        query=req.query,
        results=results,
        total_results=len(results),
        is_constitutional=is_constitutional,
        non_constitutional_note=note,
    )
