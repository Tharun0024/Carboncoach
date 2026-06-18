from typing import Dict, Any

from .constants import WEEKS_PER_MONTH, AVG_FLIGHT_DISTANCE_KM, LONG_FLIGHT_DISTANCE_KM


def calculate_transport(data: Dict[str, Any], factors: Dict) -> float:
    """Calculates monthly CO2e from transport based on user data and emission factors.

    Note:
        To obtain the annual figure used on the dashboard comparisons, multiply the return value by 12.

    Args:
        data (Dict[str, Any]): The user lifestyle input containing transport habits.
        factors (Dict): The emission factors configuration.

    Returns:
        float: The calculated monthly CO2e in kg.
    """
    for k, v in data.items():
        if isinstance(v, (int, float)) and v < 0:
            raise ValueError(f"Physical quantity {k} cannot be negative")

    total = 0.0
    trans_factors = factors.get("transport", {})
    
    # Mode 1: Car
    car_km = data.get("car_km_per_week", 0)
    if car_km == 0 and data.get("commute_method") == "car":
        car_km = data.get("commute_km_per_week", 0)
    car_factor = trans_factors.get("car_petrol_km", trans_factors.get("car_gasoline", {})).get("value", 0)
    total += car_km * WEEKS_PER_MONTH * car_factor
    
    # Mode 2: Auto Rickshaw
    rickshaw_km = data.get("auto_rickshaw_km_per_week", 0)
    rickshaw_factor = trans_factors.get("auto_rickshaw_km", {}).get("value", 0)
    total += rickshaw_km * WEEKS_PER_MONTH * rickshaw_factor
    
    # Mode 3: Metro
    metro_km = data.get("metro_km_per_week", 0)
    metro_factor = trans_factors.get("metro_km", {}).get("value", 0)
    total += metro_km * WEEKS_PER_MONTH * metro_factor
    
    # Mode 4: Bus
    bus_km = data.get("bus_km_per_week", 0)
    if bus_km == 0 and data.get("commute_method") == "public_transit":
        bus_km = data.get("commute_km_per_week", 0)
    bus_factor = trans_factors.get("bus_km", trans_factors.get("public_transit_bus", {})).get("value", 0)
    total += bus_km * WEEKS_PER_MONTH * bus_factor
    
    # Mode 5: Two Wheeler
    two_wheeler_km = data.get("two_wheeler_km_per_week", 0)
    two_wheeler_factor = trans_factors.get("two_wheeler_km", {}).get("value", 0)
    total += two_wheeler_km * WEEKS_PER_MONTH * two_wheeler_factor

    # Flights
    flights = data.get("flights_per_year", 0)
    flight_factor = trans_factors.get("flight_km", {}).get("value", 0)
    if flights > 0:
        total += (flights * AVG_FLIGHT_DISTANCE_KM * flight_factor) / 12
    else:
        short_flights = data.get("flights_per_year_short", 0)
        long_flights = data.get("flights_per_year_long", 0)
        short_flight_factor = trans_factors.get("flight_short", {}).get("value", 0)
        long_flight_factor = trans_factors.get("flight_long", {}).get("value", 0)
        total += (short_flights * AVG_FLIGHT_DISTANCE_KM * (short_flight_factor or flight_factor)) / 12
        total += (long_flights * LONG_FLIGHT_DISTANCE_KM * (long_flight_factor or flight_factor)) / 12
        
    return total
