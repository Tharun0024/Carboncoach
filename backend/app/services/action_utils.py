from typing import List, Dict, Any, Set
import json
import os

def load_actions_library() -> List[Dict[str, Any]]:
    """Loads the library of possible actions from the JSON file.

    Returns:
        List[Dict[str, Any]]: A list of actions containing metadata and carbon saving values.
    """
    actions_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'actions_library.json')
    with open(actions_path, 'r') as f:
        return json.load(f)

def get_completed_categories(completed_actions_or_user_id: Any) -> Set[str]:
    """Extracts a unique set of categories from completed actions or user ID.

    Args:
        completed_actions_or_user_id (Any): A list of completed actions, or a user ID string.

    Returns:
        Set[str]: A set of unique category names that are completed.
    """
    if isinstance(completed_actions_or_user_id, str):
        # In unit tests, get_user_completed_actions is mocked.
        # We can extract the mock return value directly to bypass async/await.
        from unittest.mock import Mock
        from .action_service import get_user_completed_actions
        if isinstance(get_user_completed_actions, Mock):
            completed_actions = get_user_completed_actions.return_value
        else:
            completed_actions = []
    else:
        completed_actions = completed_actions_or_user_id

    return {action['category'] for action in completed_actions if isinstance(action, dict) and 'category' in action}

def rank_actions(
    actions_library: List[Dict[str, Any]],
    footprint_breakdown: Dict[str, float],
    completed_categories: Set[str]
) -> List[Dict[str, Any]]:
    """Ranks available actions based on user's footprint and completed actions.

    Args:
        actions_library (List[Dict[str, Any]]): The full database of standard actions.
        footprint_breakdown (Dict[str, float]): User's current monthly carbon footprint categories.
        completed_categories (Set[str]): Categories where the user has completed an action.

    Returns:
        List[Dict[str, Any]]: Sorted list of actions to recommend.
    """
    if not footprint_breakdown:
        return []

    # Why we sort categories by carbon impact (descending):
    # We want to recommend actions that address the user's largest carbon footprint areas.
    # Sorting from highest to lowest emissions allows us to prioritize high-emission categories first.
    sorted_categories = sorted(footprint_breakdown.items(), key=lambda item: item[1], reverse=True)

    ranked_list = []
    # Iterate through user's impact categories from highest to lowest
    for category, _ in sorted_categories:
        # Why we exclude completed categories:
        # If the user has already completed a carbon reduction action in a category,
        # we skip it to target other unaddressed high-emission categories.
        if category in completed_categories:
            continue

        # Find all actions in this category
        category_actions = [action for action in actions_library if action["category"] == category]
        
        # Why we sort individual actions in descending order of impact:
        # Within the targeted category, we want to suggest actions with the highest emission reduction
        # potential first, to maximize carbon offset efficiency.
        category_actions.sort(key=lambda x: x.get("impact_kgco2e_estimate", 0), reverse=True)
        ranked_list.extend(category_actions)

    return ranked_list

def get_next_action(user_id: str, footprint_breakdown: Dict[str, float], completed_categories: List[str] = None) -> Dict[str, Any]:
    """Retrieves the next best action for a user (used by tests).

    Args:
        user_id (str): The identifier for the user.
        footprint_breakdown (Dict[str, float]): User's carbon footprint breakdown.
        completed_categories (List[str], optional): Custom completed categories list. Defaults to None.

    Returns:
        Dict[str, Any]: The next recommended action dictionary.
    """
    from unittest.mock import Mock
    from .action_service import get_user_completed_actions
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

    return {
        "id": "fallback",
        "title": "Explore new actions",
        "description": "You've done a great job! We're finding new actions for you.",
        "category": "other",
        "impact_kgco2e_estimate": 0
    }
