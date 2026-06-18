"""Domain constants for the carbon footprint calculation engine.

Centralises magic numbers and shared fallback values so that
every service module references a single source of truth.
"""

from typing import Dict, Any

# Time conversion: average weeks in a calendar month
WEEKS_PER_MONTH: float = 52 / 12

# Dietary estimation: assumed meals per month
MEALS_PER_MONTH: float = 30.0

# Aviation distance assumptions (km)
AVG_FLIGHT_DISTANCE_KM: int = 1_000
LONG_FLIGHT_DISTANCE_KM: int = 5_000

# Default household size when user omits the field
DEFAULT_HOUSEHOLD_SIZE: int = 2

# Shared fallback action returned when no more actions are available
FALLBACK_ACTION: Dict[str, Any] = {
    "id": "fallback",
    "title": "Explore new actions",
    "description": "You've done a great job! We're finding new actions for you.",
    "category": "other",
    "impact_kgco2e_estimate": 0,
}
