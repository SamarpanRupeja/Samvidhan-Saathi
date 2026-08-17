"""
AI service — Real-time conversational RAG pipeline using Google Gemini for constitutional Q&A.
"""

import google.generativeai as genai
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.search_service import search_articles
from app.services.content_service import get_article_by_id

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Supported active Gemini models in order of priority
GEMINI_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest",
]

SYSTEM_PROMPT_EN = """You are Samvidhan Saathi (Constitutional Companion), an expert, engaging, and authoritative AI assistant on the Constitution of India. Your mission is to help Indian citizens, students, and aspirants deeply understand their constitutional rights, duties, and protections in clear, practical, and inspiring terms.

CRITICAL INSTRUCTIONS:
1. Real-Time Deep Explanation: Deliver full, comprehensive, conversational answers with real-world examples, analogies, and actionable legal understanding (like ChatGPT / Gemini / Claude).
2. Constitutional Precision: Always cite specific Article numbers (e.g., Article 14, Article 19(1)(a), Article 21, Article 22, Article 32, etc.) and explain what each clause actually protects.
3. Landmark Precedents: Mention relevant landmark Supreme Court decisions (e.g. Maneka Gandhi, Puttaswamy privacy ruling, Kesavananda Bharati, D.K. Basu arrest guidelines) to make the answer authoritative.
4. Structure & Readability: Use bold headings, bullet points, and numbered lists to make the answer easy to scan and digest.
5. Practical Advice: When someone asks about a problem (e.g., police arrest, employer demands, college protests), provide concrete steps on what rights they can assert."""

SYSTEM_PROMPT_HI = """आप संविधान साथी (Samvidhan Saathi) हैं — भारतीय संविधान पर एक अत्यंत बुद्धिमान, संवादात्मक और विशेषज्ञ AI सहायक।

महत्वपूर्ण निर्देश:
1. संपूर्ण और स्पष्ट उत्तर दें (जैसे ChatGPT / Gemini कार्य करता है)।
2. हमेशा संबंधित अनुच्छेदों (जैसे अनुच्छेद 14, 19, 21, 22, 32 आदि) का स्पष्ट उल्लेख करें।
3. दैनिक जीवन के उदाहरणों और सुप्रीम कोर्ट के ऐतिहासिक निर्णयों (जैसे पुट्टस्वामी, मेनका गांधी, डी.के. बसु) के साथ समझाएं।
4. बुलेट पॉइंट्स और शीर्षकों का उपयोग करें ताकि पढ़ना आसान हो।"""

SYSTEM_PROMPT_HINGLISH = """Aap Samvidhan Saathi (Constitutional Companion) hain — Indian Constitution par ek smart, friendly aur conversational AI assistant (jaise ChatGPT / Gemini / Claude).

Important Guidelines:
1. Natural, easy-to-understand Hinglish mein real-time detailed answer dein.
2. Hamesha exact Article numbers (e.g. Article 14, 19, 21, 22, 32) mention karein aur unka practical meaning samjhayein.
3. Supreme Court ke landmark judgments aur daily life situations ke examples dein.
4. Headings aur bullet points use karein taaki citizen ko apne rights instantly clear ho sakein."""


def _get_system_prompt(language: str) -> str:
    """Get the system prompt for the given language."""
    prompts = {
        "en": SYSTEM_PROMPT_EN,
        "hi": SYSTEM_PROMPT_HI,
        "hinglish": SYSTEM_PROMPT_HINGLISH,
    }
    return prompts.get(language, SYSTEM_PROMPT_EN)


def _get_mode_instruction(mode: str) -> str:
    """Get additional instruction based on explanation mode."""
    if mode == "simple":
        return "\nRespond in simple, relatable language with real-world daily life examples suitable for a school student or general citizen. 150-250 words."
    elif mode == "student":
        return "\nRespond at a college / graduate student level with legal terminology, constitutional history, and landmark Supreme Court cases. 250-400 words."
    else:
        return "\nProvide a scholarly, detailed analysis suitable for a civil services aspirant or law student, including constitutional doctrines, bare act text, multiple case citations, and amendment history. 450+ words."


async def ask_question(session: AsyncSession, query: str, language: str = "en",
                       mode: str = "simple") -> dict:
    """
    Real-time RAG pipeline: search for relevant articles, build context, and generate with Gemini.
    """
    # Step 1: Retrieve relevant articles
    search_results = await search_articles(session, query, top_k=5)

    # Step 2: Build context from retrieved articles
    context_parts = []
    sources = []
    related_article_ids = []

    for result in search_results:
        article = await get_article_by_id(session, result["article_id"])
        if article:
            context_parts.append(
                f"Article {article.article_number} — {article.article_title}:\n"
                f"Original Text: {article.original_text}\n"
                f"Simplified Summary: {article.simplified_text_en or ''}\n"
            )
            sources.append({
                "type": "constitutional_article",
                "reference": f"Article {article.article_number}",
                "text_snippet": (article.simplified_text_en or article.original_text)[:200],
                "article_id": article.article_id,
            })
            related_article_ids.append(article.article_id)

    context = "\n---\n".join(context_parts) if context_parts else "General Constitution of India context."

    # Step 3: Build prompt
    system_prompt = _get_system_prompt(language)
    mode_instruction = _get_mode_instruction(mode)

    user_prompt = f"""CONSTITUTIONAL REFERENCE CONTEXT:
{context}

CITIZEN'S QUESTION:
{query}

INSTRUCTIONS:
{mode_instruction}

Answer the citizen directly, warmly, and authoritatively. Cite the exact constitutional articles that protect them."""

    # Step 4: Real-time generation with Gemini models
    if settings.GEMINI_API_KEY:
        for model_name in GEMINI_MODELS:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(
                    [
                        {"role": "user", "parts": [{"text": system_prompt + "\n\n" + user_prompt}]},
                    ],
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.4,
                        max_output_tokens=1200,
                    ),
                )

                if response and response.text:
                    confidence = min(0.65 + (len(search_results) * 0.08), 0.98)
                    return {
                        "answer": response.text,
                        "confidence": round(confidence, 2),
                        "language": language,
                        "sources": sources,
                        "related_articles": related_article_ids,
                        "is_constitutional": True,
                        "non_constitutional_note": None,
                    }
            except Exception as e:
                print(f"Model {model_name} failed: {e}, trying next candidate...")
                continue

    # Step 5: Fallback if no LLM responded
    return _fallback_answer(query, search_results, sources, related_article_ids, language)


def _fallback_answer(query: str, search_results: list, sources: list,
                     related_article_ids: list, language: str) -> dict:
    """Fallback response if LLM is temporarily unreachable."""
    if not search_results:
        answer = "I couldn't locate a specific article for this exact wording. The Constitution of India protects fundamental freedoms including equality (Art 14), liberty & life (Art 21), and constitutional remedies (Art 32). Please ask about a specific right or situation."
    else:
        parts = ["Based on the Constitution of India, here are the most relevant provisions:\n"]
        for r in search_results[:3]:
            parts.append(f"📜 **Article {r['article_number']}** — {r['article_title']}")
            parts.append(f"   {r['snippet']}\n")
        answer = "\n".join(parts)

    return {
        "answer": answer,
        "confidence": 0.75 if search_results else 0.4,
        "language": language,
        "sources": sources,
        "related_articles": related_article_ids,
        "is_constitutional": True,
        "non_constitutional_note": None,
    }


async def classify_situation(session: AsyncSession, situation: str, language: str = "en") -> dict:
    """
    Classify whether a situation is constitutional or ordinary law.
    """
    constitutional_keywords = [
        "right", "freedom", "liberty", "equality", "discrimination", "arrest",
        "fundamental", "constitution", "article", "amendment", "writ", "privacy",
        "अधिकार", "स्वतंत्रता", "समानता", "गिरफ्तारी", "संविधान", "पुलिस",
    ]

    situation_lower = situation.lower()
    keyword_matches = sum(1 for kw in constitutional_keywords if kw in situation_lower)
    is_constitutional = keyword_matches >= 1

    search_results = await search_articles(session, situation, top_k=3)
    relevant_articles = [r["article_id"] for r in search_results]
    category = "fundamental_rights" if is_constitutional else "ordinary_law"

    return {
        "is_constitutional": is_constitutional,
        "category": category,
        "confidence": min(0.6 + (keyword_matches * 0.1), 0.95),
        "explanation": "This situation directly involves constitutional rights and procedural protections." if is_constitutional else "This matter involves general civil/criminal law with constitutional dimensions.",
        "relevant_articles": relevant_articles,
    }
