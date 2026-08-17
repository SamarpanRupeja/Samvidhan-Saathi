"""
Samvidhan Saathi — FastAPI Application Entry Point

Run locally: uvicorn app.main:app --reload --port 8000
API docs: http://localhost:8000/docs
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import engine, create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: create tables if they don't exist
    print("[*] Samvidhan Saathi API starting...")
    await create_tables()
    print("[+] Database tables ready")
    print(f"[i] API docs at: http://localhost:8000/docs")
    yield
    # Shutdown: close database engine
    await engine.dispose()
    print("[*] Samvidhan Saathi API shutting down")


app = FastAPI(
    title="Samvidhan Saathi API",
    description=(
        "Constitutional Companion — AI-powered platform to help Indian citizens "
        "understand their constitutional rights, duties, and principles. "
        "Features situation-based search, multi-level explanations, interactive scenarios, "
        "and a RAG-powered AI assistant with source verification."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "name": "Samvidhan Saathi API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "description": "Your Constitutional Companion",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "ai_service": "gemini" if settings.GEMINI_API_KEY else "fallback",
    }
