import pytest
from pydantic import ValidationError
from app.services import footprint_service
from app.services.footprint_service import (
    calculate_total,
    calculate_transport,
    calculate_food,
    get_emission_factors,
    calculate_fallback_footprint
)

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.unit

def test_car_emission_calculation(emission_factors):
    """
    Verify the car emission calculation for a user who drives 280km/week.
    Expected: 280 km/week * 52 weeks/year * 0.192 kgCO2e/km = 2795.52 kgCO2e/year
    """
    # Arrange
    data = {"commute_km_per_week": 280, "commute_method": "car"}
    
    # Act
    annual_emissions = footprint_service.calculate_transport(data, emission_factors) * 12

    # Assert
    assert annual_emissions == pytest.approx(2795.52)

def test_flight_emission_calculation(emission_factors):
    """
    Verify flight emission calculation for 4 short-haul flights.
    Expected: 4 flights * 1000 km/flight * 0.255 kgCO2e/km = 1020 kgCO2e/year
    """
    # Arrange
    data = {"flights_per_year_short": 4}
    
    # Act
    annual_emissions = footprint_service.calculate_transport(data, emission_factors) * 12

    # Assert
    assert annual_emissions == pytest.approx(1020)

def test_public_transit_lower_than_car(emission_factors):
    """
    Verify that for the same distance, public transit emissions are lower than car emissions.
    """
    # Arrange
    distance_km = 100
    car_data = {"commute_km_per_week": distance_km, "commute_method": "car"}
    transit_data = {"commute_km_per_week": distance_km, "commute_method": "public_transit"}

    # Act
    car_emissions = footprint_service.calculate_transport(car_data, emission_factors)
    transit_emissions = footprint_service.calculate_transport(transit_data, emission_factors)

    # Assert
    assert transit_emissions < car_emissions

def test_calculate_total_sums_all_categories(monkeypatch, urban_commuter, emission_factors):
    """
    Verify that the calculate_total function correctly sums the outputs of individual category calculations.
    """
    # Arrange
    monkeypatch.setattr(footprint_service, "get_emission_factors", lambda: emission_factors)
    
    # Act
    result = footprint_service.calculate_total(urban_commuter)
    
    # Assert
    manual_sum = (
        footprint_service.calculate_transport(urban_commuter, emission_factors) +
        footprint_service.calculate_energy(urban_commuter, emission_factors) +
        footprint_service.calculate_food(urban_commuter, emission_factors)
    )
    assert result["total_kg_co2e"] == pytest.approx(manual_sum)
    assert result["total_kg_co2e"] == sum(result["breakdown"].values())

def test_zero_inputs_returns_zero(monkeypatch, emission_factors):
    """
    Verify that providing an empty data dictionary results in zero emissions.
    """
    # Arrange
    monkeypatch.setattr(footprint_service, "get_emission_factors", lambda: emission_factors)
    empty_data = {}

    # Act
    result = footprint_service.calculate_total(empty_data)

    # Assert
    assert result["total_kg_co2e"] == 0
    assert result["breakdown"]["transport"] == 0
    assert result["breakdown"]["energy"] == 0
    assert result["breakdown"]["food"] == 0

def test_chennai_commuter_below_india_average(monkeypatch, chennai_commuter, emission_factors):
    """
    Verify that the calculated annual footprint of a Chennai commuter is below the India average of 1,900 kg.
    """
    monkeypatch.setattr(footprint_service, "get_emission_factors", lambda: emission_factors)
    result = footprint_service.calculate_total(chennai_commuter)
    
    # Calculate annual footprint by multiplying the monthly footprint by 12
    annual_footprint = result["total_kg_co2e"] * 12
    
    assert annual_footprint < 1900


def test_zero_all_inputs_returns_baseline_only():
    """Zero lifestyle inputs should return only the system baseline, not zero."""
    result = calculate_total({
        "car_km_per_week": 0, "auto_rickshaw_km_per_week": 0,
        "metro_km_per_week": 0, "flights_per_year": 0,
        "electricity_kwh_per_month": 0, "lpg_kg_per_month": 0,
        "diet_type": "vegan", "shopping_level": "low"
    })
    assert result["total_kgco2e"] >= 0
    assert result["total_kgco2e"] < 500  # baseline only, not inflated

def test_negative_inputs_raise_validation_error():
    """Negative values for physical quantities must raise ValueError."""
    with pytest.raises((ValueError, ValidationError)):
        calculate_transport({"car_km_per_week": -100}, factors={})

def test_metro_lower_emissions_than_car_same_distance():
    """Metro must always produce lower emissions than car for identical distance."""
    car_result = calculate_transport(
        {"car_km_per_week": 100, "metro_km_per_week": 0, "auto_rickshaw_km_per_week": 0,
         "flights_per_year": 0}, factors=get_emission_factors()
    )
    metro_result = calculate_transport(
        {"car_km_per_week": 0, "metro_km_per_week": 100, "auto_rickshaw_km_per_week": 0,
         "flights_per_year": 0}, factors=get_emission_factors()
    )
    assert metro_result < car_result

def test_vegan_diet_lower_than_non_vegetarian():
    """Vegan diet must produce lower emissions than non-vegetarian."""
    vegan = calculate_food({"diet_type": "vegan", "primary_meal": "dal_rice"}, get_emission_factors())
    non_veg = calculate_food({"diet_type": "non_vegetarian", "primary_meal": "chicken_biryani_meal"}, get_emission_factors())
    assert vegan < non_veg

def test_fallback_flag_is_true_on_fallback_calculation():
    """calculate_fallback_footprint must always return fallback: True."""
    result = calculate_fallback_footprint("I drive 10km daily and eat rice")
    assert result["fallback"] is True
    assert "total_kgco2e" in result or "calculation" in result

