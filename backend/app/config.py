from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Supabase
    supabase_url: str
    supabase_key: str

    # Anthropic Claude API
    anthropic_api_key: str

    # Rate Limiter
    rate_limit_enabled: bool = True

    # Frontend URL for CORS
    frontend_url: str = "http://localhost:3000"

    # model_config allows pydantic to load from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached instance of the application settings.
    Using lru_cache ensures the settings are loaded only once.
    """
    return Settings()
