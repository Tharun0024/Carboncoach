import json
import os
import re
from typing import Dict, Any
from .footprint_utils import calculate_transport
from .footprint_energy_food import calculate_energy, calculate_food

__all__ = [
    "load_emission_factors_from_json",
    "calculate_transport",
    "calculate_energy",
    "calculate_food",
    "get_emission_factors",
    "calculate_total",
    "calculate_fallback_footprint"
]

def load_emission_factors_from_json() -> Dict:
    """Loads the emission factors data from the JSON file.

    Returns:
        Dict: The loaded emission factors configuration.
    """
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'emission_factors.json')
    with open(path, 'r') as f:
        return json.load(f)

_emission_factors = None

def get_emission_factors() -> Dict:
    """Returns cached emission factors.

    Returns:
        Dict: The cached emission factors configuration.
    """
    global _emission_factors
    if _emission_factors is None:
        _emission_factors = load_emission_factors_from_json()
    return _emission_factors

def calculate_total(lifestyle_data: Dict[str, Any], emission_factors: Dict = None) -> Dict[str, Any]:
    """Calculates the total carbon footprint and its breakdown by category.

    Args:
        lifestyle_data (Dict[str, Any]): The user's input lifestyle assessment data.
        emission_factors (Dict, optional): Custom emission factors mapping. Defaults to None.

    Returns:
        Dict[str, Any]: A dictionary containing total monthly kg CO2e and category breakdown.
    """
    if emission_factors is None:
        emission_factors = get_emission_factors()

    if not emission_factors:
        raise ValueError("Emission factors not available.")

    breakdown = {
        "transport": calculate_transport(lifestyle_data, emission_factors),
        "energy": calculate_energy(lifestyle_data, emission_factors),
        "food": calculate_food(lifestyle_data, emission_factors),
        "other": 0.0
    }
    
    total = sum(breakdown.values())
    
    return {
        "total_kg_co2e": total,
        "total_kgco2e": total,
        "breakdown": breakdown
    }

def calculate_fallback_footprint(user_message: str) -> Dict[str, Any]:
    """Calculates a fallback carbon footprint using simple regex/heuristics on user message.

    Args:
        user_message (str): The raw text message sent by the user.

    Returns:
        Dict[str, Any]: A valid assessment payload carrying raw data and a fallback flag.
    """
    # Simple regex extractions for partial values
    km_match = re.search(r'(\d+)\s*km', user_message, re.IGNORECASE)
    commute_km = int(km_match.group(1)) if km_match else 15
    
    kwh_match = re.search(r'(\d+)\s*kwh', user_message, re.IGNORECASE)
    electricity = int(kwh_match.group(1)) if kwh_match else 120
    
    # Diet heuristic mappings
    diet = "vegetarian"
    if any(keyword in user_message.lower() for keyword in ["chicken", "non-veg", "meat"]):
        diet = "non_vegetarian"
    elif "beef" in user_message.lower():
        diet = "beef"
        
    primary_meal = "dal_rice"
    if "biryani" in user_message.lower():
        primary_meal = "chicken_biryani"
    elif "thali" in user_message.lower():
        primary_meal = "veg_thali"

    fallback_lifestyle = {
        "auto_rickshaw_km_per_week": 10,
        "metro_km_per_week": 15,
        "car_km_per_week": 0,
        "flights_per_year": 0,
        "electricity_kwh_per_month": electricity,
        "lpg_kg_per_month": 8,
        "diet_type": diet,
        "primary_meal": primary_meal,
        "commute_km_per_week": commute_km,
        "commute_method": "public_transit"
    }

    calculation = calculate_total(fallback_lifestyle)
    
    return {
        "total_kg_co2e": calculation["total_kg_co2e"],
        "total_kgco2e": calculation["total_kg_co2e"],
        "breakdown": calculation["breakdown"],
        "raw_data": fallback_lifestyle,
        "fallback": True
    }
