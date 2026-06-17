from fastapi import APIRouter, Depends, HTTPException
from ..models.schemas import ActionResponse, UserActionUpdate
from ..services import action_service
from ..database import get_supabase_client
from supabase import Client

router = APIRouter()

@router.get("/actions/current", response_model=ActionResponse)
async def get_current_action(supabase: Client = Depends(get_supabase_client)):
    """
    Retrieves the current assigned action for the user.
    """
    user_id = "some-authenticated-user-id" # Placeholder for auth
    try:
        return await action_service.get_current_action_for_user(user_id, supabase)
    except Exception:
        raise HTTPException(status_code=404, detail="No current action assigned.")


@router.post("/actions/assign", response_model=ActionResponse)
async def assign_next_action(supabase: Client = Depends(get_supabase_client)):
    """
    Generates and assigns the next best action for the user via the action service.
    """
    user_id = "some-authenticated-user-id" # Placeholder for auth
    try:
        # All logic is now in the service layer
        new_action = await action_service.assign_new_action_for_user(user_id, supabase)
        return new_action
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/actions/{id}/complete", response_model=ActionResponse)
async def mark_action_status(id: str, update: UserActionUpdate, supabase: Client = Depends(get_supabase_client)):
    """
    Marks an action as 'completed' or 'skipped'.
    """
    user_id = "some-authenticated-user-id" # Placeholder for auth
    try:
        updated_action = await action_service.update_action_status_for_user(id, user_id, update.status, supabase)
        if not updated_action:
            raise HTTPException(status_code=404, detail="Action not found or user mismatch.")
        return updated_action
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
