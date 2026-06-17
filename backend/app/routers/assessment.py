from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..models.schemas import AssessmentCreate, AssessmentResponse
from ..services import assessment_service # Updated import
from ..database import get_supabase_client
from supabase import Client

router = APIRouter()

@router.get("/assessments", response_model=List[AssessmentResponse])
async def get_user_assessments(supabase: Client = Depends(get_supabase_client)):
    """
    Retrieves all carbon footprint assessments for the authenticated user.
    (Authentication logic to be added)
    """
    # This is a placeholder. In a real app, you'd get the user ID from an auth token.
    user_id = "some-authenticated-user-id"
    
    try:
        return await assessment_service.get_user_assessments_from_db(user_id, supabase)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/assessments", response_model=AssessmentResponse, status_code=201)
async def create_new_assessment(assessment_data: AssessmentCreate, supabase: Client = Depends(get_supabase_client)):
    """
    Creates a new carbon footprint assessment by calling the assessment service.
    """
    # Business logic is now fully in the service layer.
    try:
        created_assessment = await assessment_service.create_assessment(
            user_id=assessment_data.user_id,
            lifestyle_data=assessment_data.lifestyle_data,
            supabase=supabase
        )
        return created_assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create assessment: {e}")
