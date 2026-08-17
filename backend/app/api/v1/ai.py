"""
AI Assistant API endpoints — RAG-powered Q&A and situation classification.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.ai import (
    AIAskRequest, AIAskResponse,
    SituationClassifyRequest, SituationClassifyResponse,
)
from app.services.ai_service import ask_question, classify_situation

router = APIRouter()


@router.post("/ask", response_model=AIAskResponse)
async def ask_ai(req: AIAskRequest, session: AsyncSession = Depends(get_session)):
    """
    Ask the AI assistant a constitutional question.
    Uses RAG (Retrieval-Augmented Generation) with Google Gemini.
    Every answer includes source citations from the Constitution.
    """
    result = await ask_question(session, req.query, req.language, req.mode)
    return AIAskResponse(**result)


@router.post("/classify-situation", response_model=SituationClassifyResponse)
async def classify(req: SituationClassifyRequest, session: AsyncSession = Depends(get_session)):
    """
    Classify whether a situation is constitutional or ordinary law.
    Helps users understand when the Constitution applies to them.
    """
    result = await classify_situation(session, req.situation, req.language)
    return SituationClassifyResponse(**result)
