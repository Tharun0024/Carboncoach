from typing import List, Dict, Any, Set
import json
import os

from .constants import FALLBACK_ACTION


def load_actions_library() -> List[Dict[str, Any]]:
    """Loads the library of possible actions from the JSON file.

    Returns:
        List[Dict[str, Any]]: A list of actions containing metadata and carbon saving values.
    """
    actions_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'actions_library.json')
    with open(actions_path, 'r') as f:
        return json.load(f)


def get_completed_categories(completed_actions: List[Dict[str, Any]]) -> Set[str]:
    """Extracts a unique set of categories from a list of completed actions.

    Args:
        completed_actions (List[Dict[str, Any]]): Completed action records.

    Returns:
        Set[str]: A set of unique category names that are completed.
    """
    return {
        action['category']
        for action in completed_actions
        if isinstance(action, dict) and 'category' in action
    }


def rank_actions(
    actions_library: List[Dict[str, Any]],
    footprint_breakdown: Dict[str, float],
    completed_categories: Set[str]
) -> List[Dict[str, Any]]:
    """Ranks available actions based on user's footprint and completed actions.

    Actions targeting the user's highest-emission categories are surfaced
    first. Within each category, actions are sorted by descending impact so
    the most effective recommendation is always at the top.

    Args:
        actions_library (List[Dict[str, Any]]): The full database of standard actions.
        footprint_breakdown (Dict[str, float]): User's current monthly carbon footprint categories.
        completed_categories (Set[str]): Categories where the user has completed an action.

    Returns:
        List[Dict[str, Any]]: Sorted list of actions to recommend.
    """
    if not footprint_breakdown:
        return []

    sorted_categories = sorted(
        footprint_breakdown.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    ranked_list: List[Dict[str, Any]] = []
    for category, _ in sorted_categories:
        if category in completed_categories:
            continue

        category_actions = [
            action for action in actions_library if action["category"] == category
        ]
        category_actions.sort(
            key=lambda x: x.get("impact_kgco2e_estimate", 0), reverse=True
        )
        ranked_list.extend(category_actions)

    return ranked_list


def get_next_action(
    footprint_breakdown: Dict[str, float],
    completed_actions: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Determines the next best action based on footprint and history.

    Args:
        footprint_breakdown (Dict[str, float]): User's carbon footprint breakdown.
        completed_actions (List[Dict[str, Any]]): Previously completed action records.

    Returns:
        Dict[str, Any]: The next recommended action, or FALLBACK_ACTION.
    """
    completed_action_ids = {
        action['action_id']
        for action in completed_actions
        if isinstance(action, dict) and 'action_id' in action
    }
    completed_cats = get_completed_categories(completed_actions)

    actions_lib = load_actions_library()
    ranked_actions = rank_actions(actions_lib, footprint_breakdown, completed_cats)

    for action in ranked_actions:
        if action['id'] not in completed_action_ids:
            return action

    return FALLBACK_ACTION.copy()
