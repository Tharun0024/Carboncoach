import pytest
from app.services import footprint_service

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.unit

def test_vegan_diet_lower_than_omnivore(emission_factors):
    """
    Verify that a vegan diet results in lower emissions than an omnivore diet.
    """
    # Arrange
    vegan_data = {"diet_type": "plant_based"}
    omnivore_data = {"diet_type": "beef"}

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
    vegetarian_data = {"diet_type": "chicken"}
    omnivore_data = {"diet_type": "beef"}

    # Act
    vegan_emissions = footprint_service.calculate_food(vegan_data, emission_factors)
    vegetarian_emissions = footprint_service.calculate_food(vegetarian_data, emission_factors)
    omnivore_emissions = footprint_service.calculate_food(omnivore_data, emission_factors)

    # Assert
    assert vegan_emissions < vegetarian_emissions < omnivore_emissions
