from typing import Dict, Any

from .constants import MEALS_PER_MONTH, DEFAULT_HOUSEHOLD_SIZE

def calculate_energy(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from home energy usage.

    Note:
        To obtain the annual figure used on the dashboard comparisons, multiply the return value by 12.

    Args:
        data (Dict[str, Any]): The user lifestyle input containing energy usage data.
        factors (Dict): The emission factors configuration.

    Returns:
        float: The calculated monthly CO2e in kg.
    """
    total = 0.0
    energy_factors = factors.get("energy", {})
    
    # Electricity
    electricity_kwh = data.get("electricity_kwh_per_month", 0)
    electricity_factor = energy_factors.get("electricity_kwh", energy_factors.get("electricity", {})).get("value", 0)
    total += electricity_kwh * electricity_factor

    # LPG (Liquid Petroleum Gas cylinders)
    lpg_kg = data.get("lpg_kg_per_month", 0)
    lpg_factor = energy_factors.get("lpg_kg", {}).get("value", 0)
    total += lpg_kg * lpg_factor

    # Piped Natural Gas / PNG
    gas_m3 = data.get("gas_m3_per_month", data.get("png_m3_per_month", data.get("gas_m3", 0)))
    gas_factor = energy_factors.get("png_m3", energy_factors.get("natural_gas", {})).get("value", 0)
    total += gas_m3 * gas_factor

    # Divide by household size (defaulting to 2 if not explicitly provided)
    household_size = data.get("household_size", DEFAULT_HOUSEHOLD_SIZE)
    return total / household_size

def calculate_food(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from diet.

    Note:
        To obtain the annual figure used on the dashboard comparisons, multiply the return value by 12.

    Args:
        data (Dict[str, Any]): The user lifestyle input containing dietary type.
        factors (Dict): The emission factors configuration.

    Returns:
        float: The calculated monthly CO2e in kg.
    """
    primary_meal = data.get("primary_meal", "")
    diet = data.get("diet_type", "omnivore")
    food_factors = factors.get("food", {})
    
    # Meal-based calculation
    if primary_meal:
        meal_key = primary_meal if primary_meal.endswith("_meal") else f"{primary_meal}_meal"
        if meal_key in food_factors:
            meal_factor = food_factors.get(meal_key, {}).get("value", 0)
            return meal_factor * MEALS_PER_MONTH
            
    # Fallback to diet_type mapping if primary_meal is omitted
    consumption_map = {
        "beef": 1.5,
        "chicken": 4.0,
        "plant_based": 0.0,
        "omnivore": 2.0,
        "vegetarian": 0.0,
        "non_vegetarian": 4.0,
    }
    
    diet_key = diet
    if diet_key == "non_vegetarian":
        diet_key = "chicken"
    elif diet_key in ["plant_based", "vegetarian"]:
        diet_key = "dal_rice"
        
    factor_obj = food_factors.get(diet_key) or food_factors.get(f"{diet_key}_kg") or food_factors.get(f"{diet_key}_meal")
    factor_val = factor_obj.get("value", 0) if factor_obj else 0
    kg_consumed = consumption_map.get(diet, 2.0)
    
    return factor_val * kg_consumed
