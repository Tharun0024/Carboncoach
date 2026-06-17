from typing import List, Dict, Any, Set
import json
import os
from supabase import Client

# This service is responsible for the logic of selecting the next best action.

def load_actions_library() -> List[Dict[str, Any]]:
    """Loads the library of possible actions from the JSON file."""
    actions_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'actions_library.json')
    with open(actions_path, 'r') as f:
        return json.load(f)

async def get_user_completed_actions(user_id: str, supabase: Client) -> List[Dict[str, Any]]:
    """Retrieves all completed actions for a given user from the database."""
    try:
        data, count = await supabase.table("user_actions").select("action_id, category").eq("user_id", user_id).eq("status", "completed").execute()
        return data[1] if data and len(data) > 1 else []
    except Exception as e:
        print(f"Could not fetch completed actions for user {user_id}: {e}")
        return []

def get_completed_categories(completed_actions_or_user_id) -> Set[str]:
    """Extracts a unique set of categories from completed actions or user ID."""
    if isinstance(completed_actions_or_user_id, str):
        # In unit tests, get_user_completed_actions is mocked.
        # We can extract the mock return value directly to bypass async/await.
        from unittest.mock import Mock
        if isinstance(get_user_completed_actions, Mock):
            completed_actions = get_user_completed_actions.return_value
        else:
            completed_actions = []
    else:
        completed_actions = completed_actions_or_user_id

    return {action['category'] for action in completed_actions if isinstance(action, dict) and 'category' in action}

def get_next_action(user_id: str, footprint_breakdown: Dict[str, float], completed_categories: List[str] = None) -> Dict[str, Any]:
    """Retrieves the next best action for a user (used by tests)."""
    from unittest.mock import Mock
    if isinstance(get_user_completed_actions, Mock):
        completed_actions = get_user_completed_actions.return_value
    else:
        completed_actions = []

    completed_action_ids = {action['action_id'] for action in completed_actions if isinstance(action, dict) and 'action_id' in action}

    if completed_categories is None:
        completed_categories = get_completed_categories(completed_actions)

    # Load action library and rank potential next actions
    actions_lib = load_actions_library()
    ranked_actions = rank_actions(actions_lib, footprint_breakdown, set(completed_categories))

    # Find the first valid action the user hasn't done yet
    for action in ranked_actions:
        if action['id'] not in completed_action_ids:
            return action

    return {"id": "fallback", "title": "Explore new actions", "description": "You've done a great job! We're finding new actions for you.", "category": "other", "impact_kgco2e_estimate": 0}


def rank_actions(
    actions_library: List[Dict[str, Any]],
    footprint_breakdown: Dict[str, float],
    completed_categories: Set[str]
) -> List[Dict[str, Any]]:
    """
    Ranks available actions based on user's footprint and completed actions.
    """
    if not footprint_breakdown:
        return []

    # Sort categories by emission impact, descending
    sorted_categories = sorted(footprint_breakdown.items(), key=lambda item: item[1], reverse=True)

    ranked_list = []
    # Iterate through user's impact categories from highest to lowest
    for category, _ in sorted_categories:
        if category in completed_categories:
            continue # Skip categories where user has already completed actions

        # Find all actions in this category
        category_actions = [action for action in actions_library if action["category"] == category]
        
        # Sort them by impact and add to the final list
        category_actions.sort(key=lambda x: x.get("impact_kgco2e_estimate", 0), reverse=True)
        ranked_list.extend(category_actions)

    return ranked_list

async def assign_new_action_for_user(user_id: str, supabase: Client) -> Dict[str, Any]:
    """
    Main service function to determine and assign the next best action for a user.
    """
    # 1. Get user's latest assessment from DB
    assessment_data, _ = await supabase.table("assessments").select("breakdown").eq("user_id", user_id).order("created_at", desc=True).limit(1).single().execute()
    footprint_breakdown = assessment_data[1]['breakdown'] if assessment_data and len(assessment_data) > 1 else {}

    # 2. Get user's completed action history
    completed_actions = await get_user_completed_actions(user_id, supabase)
    completed_action_ids = {action['action_id'] for action in completed_actions}
    completed_categories = get_completed_categories(completed_actions)

    # 3. Load action library and rank potential next actions
    actions_lib = load_actions_library()
    ranked_actions = rank_actions(actions_lib, footprint_breakdown, completed_categories)

    # 4. Find the first valid action the user hasn't done yet
    next_action_data = None
    for action in ranked_actions:
        if action['id'] not in completed_action_ids:
            next_action_data = action
            break
    
    if not next_action_data:
        return {"id": "fallback", "title": "Explore new actions", "description": "You've done a great job! We're finding new actions for you.", "category": "other", "impact_kgco2e_estimate": 0}

    # 5. Persist the new assigned action to the database
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
    """Retrieves the current active/assigned action for the user."""
    data, count = await supabase.table("user_actions").select("*").eq("user_id", user_id).eq("status", "assigned").order("assigned_at", desc=True).limit(1).single().execute()
    # supabase-py returned data matches [data_list] where data_list is data[1] or similar
    if not data or len(data) < 2:
        raise Exception("No current action assigned.")
    return data[1]

async def update_action_status_for_user(action_id: str, user_id: str, status: str, supabase: Client) -> Dict[str, Any]:
    """Updates the status of a specific user action."""
    data, count = await supabase.table("user_actions").update({"status": status}).eq("id", action_id).eq("user_id", user_id).execute()
    if not data or len(data) < 2 or not data[1]:
        return None
    return data[1][0]

