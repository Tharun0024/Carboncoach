# CarbonCoach
"Your AI coach for real carbon reductions — one action at a time"

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Tests](https://img.shields.io/badge/Tests-Passing-success.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-35%2B%20passing-brightgreen)

Demo URL: [https://carboncoach.vercel.app](https://carboncoach.vercel.app/)

## The Problem
Most carbon footprint calculators are just that: calculators. They tally up your emissions based on a one-time questionnaire and present you with a daunting number, often in tonnes of CO₂e. While knowing your footprint is a good first step, these tools typically fail at the most critical part: guiding you on how to reduce it.

Users are left with a sense of "eco-anxiety" but no clear, personalized, or manageable path forward. The advice is generic ("drive less, fly less") and lacks the context of an individual's actual lifestyle, making it difficult to implement or track meaningful progress.

## The Solution
CarbonCoach is not another calculator; it's an AI-powered coach dedicated to helping you achieve real carbon reductions. It transforms the abstract concept of your carbon footprint into a concrete, week-by-week action plan.

- **Conversational Onboarding:** We start with a simple chat to understand your lifestyle, not a long, boring form.
- **Personalized Footprint Assessment:** Get a clear breakdown of your emissions, highlighting your biggest impact areas.
- **Weekly Action Assignment:** Each week, your AI coach assigns you a single, achievable action tailored to your footprint.
- **Measurable Reductions:** Every action has a quantifiable CO₂ saving, so you see the direct impact of your efforts.
- **Adaptive Coaching:** The AI adapts to your progress, answers your questions, and helps you overcome obstacles (and excuses).

## How CarbonCoach Addresses The Challenge

| Challenge Requirement | CarbonCoach Implementation |
| :--- | :--- |
| Understand footprint | AI conversational assessment → kg CO₂e breakdown |
| Track over time | Weekly dashboard with trend chart |
| Reduce footprint | Weekly action with measurable CO₂ savings |
| Personalized insights | LLM coaching grounded in user's actual numbers |
| Measurable actions | Per-action CO₂ savings + completion logging |

## Why CarbonCoach Is Different
Most carbon footprint tools stop after calculation. They show you a number but don't provide a clear path to improve it.

CarbonCoach continues where they stop by:
- **Understanding Habits:** It learns about your lifestyle through a natural conversation, not a sterile form.
- **Identifying Priorities:** It pinpoints the largest source of your emissions to focus your efforts where they matter most.
- **Assigning Achievable Actions:** You get one specific, manageable action each week, not a vague list of suggestions.
- **Measuring Real Reductions:** It tracks your progress based on the actions you complete, showing you the actual CO₂ you've saved.
- **Adapting to You:** The AI coach adapts future recommendations based on the actions you complete or skip, creating a truly personalized journey.

The goal is lasting behavior change, not just temporary awareness.

## Architecture

```
      User
       ↓
+--------------------+
| Next.js Frontend   |
+--------------------+
       ↓
+--------------------+   +-----------------+
|  FastAPI Backend   | → |   Claude API    |
+--------------------+   +-----------------+
       |
       ↓
+--------------------+
|      Supabase      |
+--------------------+

+--------------------+
|    Chat Service    |
|--------------------|
| → Extraction Flow  |
| → Check-in Flow    |
| → Question Flow    |
| → Excuse Flow      |
+--------------------+
```

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | Next.js 14 + Tailwind + shadcn/ui | UI, user interaction, and data visualization |
| Backend | FastAPI | API, business logic, and AI orchestration |
| Database | Supabase | User data, assessments, and action tracking |
| LLM | Claude | Conversational AI, coaching, and insights |
| Testing | pytest + Vitest | Unit and integration testing |
| CI | GitHub Actions | Continuous integration and automated testing |
| Deployment | Railway + Vercel | Hosting for backend and frontend |

## Assumptions

| Assumption | Value | Source |
| :--- | :--- | :--- |
| India electricity grid factor | 0.716 kg CO₂e/kWh | CEA India CO2 Baseline 2023 |
| Auto-rickshaw emission factor | 0.080 kg CO₂e/km | India GHG Program 2023 |
| Dal rice meal emission | 0.8 kg CO₂e/meal | India GHG Program 2023 |
| India daily per-capita target | 5.2 kg CO₂e/day | India GHG Program / World Bank 2023 |
| India annual per-capita average | 1900 kg CO₂e/year | India GHG Program / World Bank 2023 |
| Global annual target | 2300 kg CO₂e/year | India GHG Program / World Bank 2023 |
| Car petrol emission factor | 0.192 kg CO₂e/km | India GHG Program 2023 |
| Metro emission factor | 0.040 kg CO₂e/km | India GHG Program 2023 |
| Bus emission factor | 0.089 kg CO₂e/km | India GHG Program 2023 |
| Two-wheeler emission factor | 0.058 kg CO₂e/km | India GHG Program 2023 |
| Flight emission factor | 0.255 kg CO₂e/km | IPCC AR6 2022 |
| Beef emission factor | 27.0 kg CO₂e/kg | Our World in Data 2023 |
| Chicken emission factor | 6.9 kg CO₂e/kg | Our World in Data 2023 |
| Chicken biryani meal emission | 3.2 kg CO₂e/meal | India GHG Program 2023 |
| Veg thali meal emission | 0.9 kg CO₂e/meal | India GHG Program 2023 |
| Egg meal emission | 1.6 kg CO₂e/meal | Our World in Data 2023 |
| LPG emission factor | 2.983 kg CO₂e/kg | India GHG Program 2023 |
| PNG emission factor | 2.040 kg CO₂e/m³ | India GHG Program 2023 |

## Security Highlights
CarbonCoach implements strict, multi-layered security controls to protect user sessions and maintain service integrity:
- **Input Sanitization**: Automatically filters ASCII control characters (`\x00-\x1F\x7F-\x9F`) and normalizes whitespace configurations.
- **Prompt Injection Defense**: Proactively intercepts and blocks user queries carrying prompt injection keywords at the service boundary.
- **IP-Based Rate Limiting**: Limits high-velocity endpoint calls (e.g. 10/min on chat) using `slowapi`.
- **Response Hardening Headers**: Enforces `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and custom permissions policies globally.
- **Supabase Tenant Isolation**: Employs Row-Level Security (RLS) policies to protect session records from unauthorized cross-reads.

For detailed information, please refer to:
* [SECURITY.md](file:///y:/PW3/SECURITY.md)
* [Threat Model](file:///y:/PW3/docs/threat-model.md)
* [Security Architecture](file:///y:/PW3/docs/security-architecture.md)
* [Dependency Audit](file:///y:/PW3/docs/dependency-audit.md)
* [Security Checklist](file:///y:/PW3/docs/security-checklist.md)

## Quick Start
```bash
git clone https://github.com/your-repo/carboncoach.git
docker compose up
# Open http://localhost:3000
```

## AI Design Decisions
The AI's "brain" is structured across several dedicated prompt files (`onboarding.txt`, `checkin.txt`, `action_gen.txt`, `excuse.txt`) to ensure a clear separation of responsibilities. This modular approach makes the system more robust, maintainable, and predictable.

- `onboarding.txt`: Guides the initial conversation to extract lifestyle data for the footprint assessment.
- `checkin.txt`: Manages the weekly check-in, asking the user about their progress on the assigned action.
- `action_gen.txt`: Analyzes the user's footprint and generates the next most impactful, personalized action.
- `excuse.txt`: Handles situations where the user hasn't completed an action, providing encouragement and adaptive coaching without being judgmental.

This separation prevents "prompt leakage," where instructions for one task might interfere with another, leading to more reliable and focused AI behavior.

## Emission Data Sources
Our emission calculations are grounded in reputable, publicly available data sources, including:
- IPCC Sixth Assessment Report (AR6) 2022
- United States Environmental Protection Agency (EPA) Emission Factors Hub
- Our World In Data

## Testing
The project maintains a robust testing suite.

To run backend tests:
```bash
pytest backend/tests/
```

To run frontend tests:
```bash
vitest frontend/tests
```

## Deployment
- **Frontend:** The Next.js application is deployed to **Vercel** for optimal performance and scalability.
- **Backend:** The FastAPI application is deployed to **Railway** for seamless, containerized hosting.

## Accessibility
CarbonCoach targets WCAG 2.1 AA accessibility compliance.
