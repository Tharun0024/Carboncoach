# CarbonCoach - Judge Walkthrough

Welcome, CarbonCoach Judge! This guide will walk you through the key features, architecture highlights, and scoring touchpoints of our AI-powered Carbon Footprint Coach.

---

## The Onboarding & Chat Assessment Flow
1. **Introduction**: Start at the [Landing Page](file:///y:/PW3/frontend/src/app/page.tsx) and click **"Start my free assessment"** to navigate to the chat interface.
2. **Conversational Assessment**: Strike up a conversation. Instead of an exhausting spreadsheet form, the AI coach will ask you conversational questions about your:
   - Commute mode and distance
   - Yearly flight frequency
   - Monthly electricity usage
   - Red meat servings per week
   - Non-essential shopping habits
3. **Structured Data Extraction**: Once sufficient details are gathered (from at least 4 out of 5 categories), the backend chat service automatically formats the user's responses into a structured JSON schema, which is sent to the assessment engine.

---

## The Footprint Dashboard
1. **Footprint Card**: The assessment is calculated and visualized using a color-coded pie chart detailing transport, energy, food, and other emissions.
2. **Weekly Action Assignment**: The coach analyzes the footprint breakdown and assigns **one specific, high-impact, achievable weekly action** (e.g. going meatless for a day).
3. **Streak Badge**: Encourages long-term habit change by celebrating consecutive weekly completions.

---

## Key Scored Features to Note
- **No Calculators, Real Coaches**: The product doesn't just show a number—it implements weekly behavioral change tracking.
- **Production-Grade Separation**: Routers only handle request parsing/response generation, services handle core calculations and Supabase persistence.
- **Deep Accessibility**: Test screen reader support (aria-live, role="log") and keyboard navigation touch points (44px target sizes).
