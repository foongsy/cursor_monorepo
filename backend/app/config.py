from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    ENV: str = "development"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

settings = Settings()

