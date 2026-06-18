# Emission Factors

This document outlines the emission factors used by the CarbonCoach calculation engine to compute the carbon footprint of users. These factors have been calibrated to represent the Indian lifestyle and infrastructure context.

## Transport

| Factor | Value | Unit | Source |
| :--- | :--- | :--- | :--- |
| car_petrol_km | 0.192 | kg CO₂e / km | India GHG Program 2023 |
| auto_rickshaw_km | 0.080 | kg CO₂e / km | India GHG Program 2023 |
| metro_km | 0.040 | kg CO₂e / km | India GHG Program 2023 |
| bus_km | 0.089 | kg CO₂e / km | India GHG Program 2023 |
| two_wheeler_km | 0.058 | kg CO₂e / km | India GHG Program 2023 |
| flight_km | 0.255 | kg CO₂e / km | IPCC AR6 2022 |

## Food

| Factor | Value | Unit | Source |
| :--- | :--- | :--- | :--- |
| beef_kg | 27.0 | kg CO₂e / kg | Our World in Data 2023 |
| chicken_kg | 6.9 | kg CO₂e / kg | Our World in Data 2023 |
| chicken_biryani_meal | 3.2 | kg CO₂e / meal | India GHG Program 2023 |
| dal_rice_meal | 0.8 | kg CO₂e / meal | India GHG Program 2023 |
| veg_thali_meal | 0.9 | kg CO₂e / meal | India GHG Program 2023 |
| egg_meal | 1.6 | kg CO₂e / meal | Our World in Data 2023 |

## Energy

| Factor | Value | Unit | Source |
| :--- | :--- | :--- | :--- |
| electricity_kwh | 0.716 | kg CO₂e / kWh | CEA India CO2 Baseline 2023 |
| lpg_kg | 2.983 | kg CO₂e / kg | India GHG Program 2023 |
| png_m3 | 2.040 | kg CO₂e / m³ | India GHG Program 2023 |

## Baseline

| Factor | Value | Unit | Source |
| :--- | :--- | :--- | :--- |
| india_daily_target_kg | 5.2 | kg CO₂e / day | India GHG Program / World Bank 2023 |
| india_annual_per_capita_kg | 1900 | kg CO₂e / year | India GHG Program / World Bank 2023 |
| global_annual_target_kg | 2300 | kg CO₂e / year | India GHG Program / World Bank 2023 |

## Sources

- **India GHG Program 2023**: Standard baseline emission factors developed for the Indian context by WRI India, CII, and TERI.
- **CEA CO2 Baseline Database 2023**: Carbon Dioxide Baseline Database for the Indian Power Sector, published by the Central Electricity Authority (CEA), Ministry of Power, Government of India.
- **IPCC AR6 Working Group III 2022**: Intergovernmental Panel on Climate Change Sixth Assessment Report on Mitigation of Climate Change.
- **Our World in Data 2023**: Environmental Impacts of Food Production database, compiled from various research articles (e.g., Poore & Nemecek, 2018).
