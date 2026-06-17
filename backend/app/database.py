from supabase import create_client, Client
from .config import get_settings

def get_supabase_client() -> Client:
    """
    Factory function to create and return a Supabase client.
    
    This ensures that the client is created with the correct, centrally-managed
    configuration settings.
    """
    settings = get_settings()
    supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
    return supabase
