import json
import os
from typing import Dict, Any

# This service contains PURE FUNCTIONS only.
# No database calls, no API calls, no external state.
# It receives data, calculates results, and returns them.

def load_emission_factors_from_json() -> Dict:
    """Loads the emission factors data from the JSON file."""
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'emission_factors.json')
    with open(path, 'r') as f:
        return json.load(f)

def calculate_transport(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from transport based on user data and emission factors."""
    total = 0.0
    
    # Commute
    commute_km_per_week = data.get("commute_km_per_week", 0)
    method = data.get("commute_method", "car")
    factor_key = {
        "car": "car_gasoline",
        "public_transit": "public_transit_bus"
    }.get(method, "car_gasoline")
    
    commute_factor = factors.get("transport", {}).get(factor_key, {}).get("value", 0)
    total += commute_km_per_week * (52 / 12) * commute_factor # Monthly emissions

    # Flights (annual emissions averaged monthly)
    # Assuming 1000km for short-haul and 5000km for long-haul for calculation
    short_flights = data.get("flights_per_year_short", 0)
    long_flights = data.get("flights_per_year_long", 0)
    short_flight_factor = factors.get("transport", {}).get("flight_short", {}).get("value", 0)
    long_flight_factor = factors.get("transport", {}).get("flight_long", {}).get("value", 0)
    
    total += (short_flights * 1000 * short_flight_factor) / 12
    total += (long_flights * 5000 * long_flight_factor) / 12
    
    return total

def calculate_energy(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from home energy usage."""
    total = 0.0
    
    # Electricity
    electricity_kwh = data.get("electricity_kwh_per_month", 0)
    electricity_factor = factors.get("energy", {}).get("electricity", {}).get("value", 0)
    total += electricity_kwh * electricity_factor

    # Natural Gas
    gas_m3 = data.get("gas_m3_per_month", 0)
    gas_factor = factors.get("energy", {}).get("natural_gas", {}).get("value", 0)
    total += gas_m3 * gas_factor

    return total

def calculate_food(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from diet."""
    diet = data.get("diet_type", "omnivore") # e.g., 'beef', 'chicken', 'plant_based'
    
    # This is a simplified model. Assume average consumption per month.
    # A better model would use weekly servings.
    # kg_per_month mapping
    consumption_map = {
        "beef": 1.5, # kg of beef per month
        "chicken": 4.0, # kg of chicken per month
        "plant_based": 0, # Base
        "omnivore": 2.0, # Average mix
        "vegetarian": 0,
    }
    
    food_factor = factors.get("food", {}).get(diet, {}).get("value", 0)
    kg_consumed = consumption_map.get(diet, 2.0)
    
    return food_factor * kg_consumed

_emission_factors = None

def get_emission_factors() -> Dict:
    """Returns cached emission factors."""
    global _emission_factors
    if _emission_factors is None:
        _emission_factors = load_emission_factors_from_json()
    return _emission_factors

def calculate_total(lifestyle_data: Dict[str, Any], emission_factors: Dict = None) -> Dict[str, float]:
    """
    Calculates the total carbon footprint and its breakdown by category.
    """
    if emission_factors is None:
        emission_factors = get_emission_factors()

    if not emission_factors:
        raise ValueError("Emission factors not available.")

    breakdown = {
        "transport": calculate_transport(lifestyle_data, emission_factors),
        "energy": calculate_energy(lifestyle_data, emission_factors),
        "food": calculate_food(lifestyle_data, emission_factors),
        "other": 0.0 # Placeholder for other categories
    }
    
    total = sum(breakdown.values())
    
    return {
        "total_kg_co2e": total,
        "breakdown": breakdown
    }

