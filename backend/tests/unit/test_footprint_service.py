import pytest
from app.services import footprint_service

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.unit

def test_car_emission_calculation(emission_factors):
    """
    Verify the car emission calculation for a user who drives 280km/week.
    Expected: 280 km/week * 52 weeks/year * 0.21 kgCO2e/km = 3057.6 kgCO2e/year
    """
    # Arrange
    # The calculation in the service is monthly, so we adjust the test data
    data = {"commute_km_per_week": 280, "commute_method": "car"}
    
    # Act
    # The service function calculates monthly emissions, so we multiply by 12 for annual
    annual_emissions = footprint_service.calculate_transport(data, emission_factors) * 12

    # Assert
    assert annual_emissions == pytest.approx(3057.6)

def test_flight_emission_calculation(emission_factors):
    """
    Verify flight emission calculation for 4 short-haul flights.
    Assuming a short-haul flight is 1000km for calculation purposes.
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

def test_vegan_diet_lower_than_omnivore(emission_factors):
    """
    Verify that a vegan diet results in lower emissions than an omnivore diet.
    """
    # Arrange
    vegan_data = {"diet_type": "plant_based"}
    omnivore_data = {"diet_type": "beef"} # Assuming beef is the highest impact omnivore diet

    # Act
    vegan_emissions = footprint_service.calculate_food(vegan_data, emission_factors)
    omnivore_emissions = footprint_service.calculate_food(omnivore_data, emission_factors)

    # Assert
    assert vegan_emissions < omnivore_emissions

def test_vegetarian_diet_between_vegan_and_omnivore(emission_factors):
    """
    Verify that a vegetarian diet's emissions are between a vegan and omnivore diet.
    """
    # Arrange
    vegan_data = {"diet_type": "plant_based"}
    vegetarian_data = {"diet_type": "chicken"} # Using chicken to represent vegetarian for this test
    omnivore_data = {"diet_type": "beef"}

    # Act
    vegan_emissions = footprint_service.calculate_food(vegan_data, emission_factors)
    vegetarian_emissions = footprint_service.calculate_food(vegetarian_data, emission_factors)
    omnivore_emissions = footprint_service.calculate_food(omnivore_data, emission_factors)

    # Assert
    assert vegan_emissions < vegetarian_emissions < omnivore_emissions

def test_calculate_total_sums_all_categories(monkeypatch, urban_commuter, emission_factors):
    """
    Verify that the calculate_total function correctly sums the outputs of individual category calculations.
    """
    # Arrange
    # Mock the get_emission_factors to ensure we use our test fixture
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
