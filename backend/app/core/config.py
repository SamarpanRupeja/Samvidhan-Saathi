"""
Application configuration loaded from environment variables via Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/samvidhan_saathi"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # Google Gemini
    GEMINI_API_KEY: str = ""

    # JWT
    JWT_SECRET: str = "change-this-to-a-random-64-char-string"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 1440  # 24 hours

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # App
    APP_ENV: str = "development"
    DEBUG: bool = True

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
