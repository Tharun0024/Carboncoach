from typing import Dict, Any
from . import footprint_service
from ..database import get_supabase_client
from supabase import Client

async def create_assessment(user_id: str, lifestyle_data: Dict[str, Any], supabase: Client) -> Dict[str, Any]:
    """
    Orchestrates the creation of a new assessment.
    1. Calculates the footprint.
    2. Persists the result to the database.
    3. Returns the created assessment.
    """
    # 1. Calculate footprint from pure service
    calculation_result = footprint_service.calculate_total(lifestyle_data)

    new_assessment_data = {
        "user_id": user_id,
        "total_kg_co2e": calculation_result["total_kg_co2e"],
        "breakdown": calculation_result["breakdown"],
        "raw_data": lifestyle_data
    }

    # 2. Persist to database
    try:
        data, count = await supabase.table("assessments").insert(new_assessment_data).execute()
        if not data or not data[1]:
             raise Exception("Failed to insert assessment into database.")
        return data[1][0]
    except Exception as e:
        # In a real app, you'd have more specific error handling and logging
        print(f"Error creating assessment in DB: {e}")
        raise

async def get_user_assessments_from_db(user_id: str, supabase: Client) -> list:
    """Retrieves all carbon footprint assessments for a user from the database."""
    data, count = await supabase.table("assessments").select("*").eq("user_id", user_id).execute()
    return data[1] if data and len(data) > 1 else []

