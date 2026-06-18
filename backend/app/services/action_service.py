from typing import List, Dict, Any
from supabase import Client
from .action_utils import load_actions_library, get_completed_categories, rank_actions, get_next_action

__all__ = [
    "load_actions_library", "get_completed_categories", "rank_actions", "get_next_action",
    "get_user_completed_actions", "assign_new_action_for_user",
    "get_current_action_for_user", "update_action_status_for_user"
]

async def get_user_completed_actions(user_id: str, supabase: Client) -> List[Dict[str, Any]]:
    """Retrieves all completed actions for a given user from the database.

    Args:
        user_id (str): The identifier for the user.
        supabase (Client): The Supabase database client instance.
    Returns:
        List[Dict[str, Any]]: A list of completed user action records.
    """
    try:
        data, count = await supabase.table("user_actions").select("action_id, category").eq("user_id", user_id).eq("status", "completed").execute()
        return data[1] if data and len(data) > 1 else []
    except Exception as e:
        print(f"Could not fetch completed actions for user {user_id}: {e}")
        return []

async def assign_new_action_for_user(user_id: str, supabase: Client) -> Dict[str, Any]:
    """Main service function to determine and assign the next best action for a user.

    Args:
        user_id (str): The identifier for the user.
        supabase (Client): The Supabase database client instance.
    Returns:
        Dict[str, Any]: The newly assigned action record, persisted in the database.
    """
    assessment_data, _ = await supabase.table("assessments").select("breakdown").eq("user_id", user_id).order("created_at", desc=True).limit(1).single().execute()
    footprint_breakdown = assessment_data[1]['breakdown'] if assessment_data and len(assessment_data) > 1 else {}

    completed_actions = await get_user_completed_actions(user_id, supabase)
    completed_action_ids = {action['action_id'] for action in completed_actions}
    completed_categories = get_completed_categories(completed_actions)

    actions_lib = load_actions_library()
    ranked_actions = rank_actions(actions_lib, footprint_breakdown, completed_categories)

    next_action_data = None
    for action in ranked_actions:
        if action['id'] not in completed_action_ids:
            next_action_data = action
            break
    
    if not next_action_data:
        return {
            "id": "fallback",
            "title": "Explore new actions",
            "description": "You've done a great job! We're finding new actions for you.",
            "category": "other",
            "impact_kgco2e_estimate": 0
        }

    new_action_to_insert = {
        "user_id": user_id,
        "action_id": next_action_data['id'],
        "status": "assigned",
        "title": next_action_data['title'],
        "description": next_action_data['description'],
        "category": next_action_data['category'],
        "potential_savings_kg_co2e": next_action_data['impact_kgco2e_estimate']
    }
    
    insert_res, _ = await supabase.table("user_actions").insert(new_action_to_insert).execute()
    if not insert_res or not insert_res[1]:
        raise Exception("Failed to assign new action in database.")
    return insert_res[1][0]

async def get_current_action_for_user(user_id: str, supabase: Client) -> Dict[str, Any]:
    """Retrieves the current active/assigned action for the user.

    Args:
        user_id (str): The identifier for the user.
        supabase (Client): The Supabase database client instance.
    Returns:
        Dict[str, Any]: The active action record for the user.
    """
    data, count = await supabase.table("user_actions").select("*").eq("user_id", user_id).eq("status", "assigned").order("assigned_at", desc=True).limit(1).single().execute()
    if not data or len(data) < 2:
        raise Exception("No current action assigned.")
    return data[1]

async def update_action_status_for_user(action_id: str, user_id: str, status: str, supabase: Client) -> Dict[str, Any]:
    """Updates the status of a specific user action.

    Args:
        action_id (str): The unique database row ID of the user action.
        user_id (str): The identifier for the user.
        status (str): The new status to apply (e.g. 'completed', 'skipped').
        supabase (Client): The Supabase database client instance.
    Returns:
        Dict[str, Any]: The updated user action record, or None if update failed.
    """
    data, count = await supabase.table("user_actions").update({"status": status}).eq("id", action_id).eq("user_id", user_id).execute()
    if not data or len(data) < 2 or not data[1]:
        return None
    return data[1][0]
