import pytest
from unittest.mock import patch
from app.services import action_service

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.unit

@pytest.fixture
def mock_db_actions():
    """Fixture to mock the return value of database calls for user actions."""
    return [
        {"id": "ua_1", "action_id": "act_03", "category": "food", "status": "completed"},
        {"id": "ua_2", "action_id": "act_04", "category": "food", "status": "completed"},
    ]

def test_excludes_completed_actions_from_candidates(actions_library):
    """
    Verify that actions from a completed category are not recommended.
    """
    # Arrange
    footprint_breakdown = {"transport": 200, "food": 500, "energy": 100} # Food is highest
    completed_categories = ["food"] # User has completed food actions

    # Act
    ranked_actions = action_service.rank_actions(actions_library, footprint_breakdown, completed_categories)

    # Assert
    # No food actions should be in the ranked list
    assert not any(action["category"] == "food" for action in ranked_actions)

def test_ranks_by_impact_descending(actions_library):
    """
    Verify that actions within the highest impact category are sorted by their estimated savings.
    """
    # Arrange
    footprint_breakdown = {"transport": 500, "food": 200, "energy": 100} # Transport is highest
    completed_categories = []

    # Act
    ranked_actions = action_service.rank_actions(actions_library, footprint_breakdown, completed_categories)
    
    # Assert
    # Check that transport actions (highest category) are placed first
    transport_actions = [action for action in actions_library if action["category"] == "transport"]
    num_transport = len(transport_actions)
    assert all(action["category"] == "transport" for action in ranked_actions[:num_transport])
    # Check that they are sorted by impact
    impacts = [action["impact_kgco2e_estimate"] for action in ranked_actions[:num_transport]]
    assert impacts == sorted(impacts, reverse=True)

def test_falls_back_to_second_category_when_first_exhausted(actions_library):
    """
    If all actions in the highest category are completed, it should suggest actions from the next highest.
    """
    # Arrange
    footprint_breakdown = {"transport": 500, "food": 400, "energy": 100} # Transport highest, food second
    completed_categories = ["transport"] # All transport actions are considered completed

    # Act
    ranked_actions = action_service.rank_actions(actions_library, footprint_breakdown, completed_categories)

    # Assert
    # The top recommended action should be from the 'food' category
    assert len(ranked_actions) > 0
    assert ranked_actions[0]["category"] == "food"

@patch("app.services.action_service.get_user_completed_actions")
def test_get_next_action_prevents_duplicates(mock_get_completed, actions_library, urban_commuter):
    """
    Verify that get_next_action does not return an action the user has already completed.
    """
    # Arrange
    footprint_breakdown = {"transport": 500, "food": 200, "energy": 100}
    # User has completed the highest impact transport action
    mock_get_completed.return_value = [{"action_id": "act_15"}] 
    
    # Act
    next_action = action_service.get_next_action("user-1", footprint_breakdown)

    # Assert
    # The next action should not be the one they already completed
    assert next_action["id"] != "act_15"
    assert next_action["category"] == "transport" # It should be the *next best* transport action

@patch("app.services.action_service.get_user_completed_actions")
def test_get_completed_categories_returns_correct_set(mock_get_completed):
    """
    Verify the helper function correctly extracts a unique set of completed categories.
    """
    # Arrange
    mock_get_completed.return_value = [
        {"category": "food"},
        {"category": "energy"},
        {"category": "food"}, # Duplicate
    ]

    # Act
    completed_categories = action_service.get_completed_categories("user-1")

    # Assert
    assert isinstance(completed_categories, set)
    assert completed_categories == {"food", "energy"}

def test_returns_fallback_if_all_actions_completed(actions_library):
    """

    If a user has completed actions in all categories, a fallback action should be returned.
    """
    # Arrange
    footprint_breakdown = {"transport": 500, "food": 400, "energy": 100}
    all_categories = set(action['category'] for action in actions_library)
    
    # Act
    ranked_actions = action_service.rank_actions(actions_library, footprint_breakdown, list(all_categories))
    next_action = action_service.get_next_action("user-1", footprint_breakdown, completed_categories=list(all_categories))

    # Assert
    assert len(ranked_actions) == 0
    assert next_action["id"] == "fallback"
