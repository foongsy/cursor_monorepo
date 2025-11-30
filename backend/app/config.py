"""
Application configuration using Pydantic Settings.
"""
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Configuration is loaded from:
    1. Environment variables
    2. .env file (if present)
    3. Default values defined here
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Environment
    ENV: str = "development"
    DEBUG: bool = True

    # Server
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    # Compression
    ENABLE_COMPRESSION: bool = True
    COMPRESSION_MINIMUM_SIZE: int = 1000  # Minimum response size in bytes to compress

    # Logging
    LOG_LEVEL: str = "INFO"


settings = Settings()

