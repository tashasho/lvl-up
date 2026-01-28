# lvlup

**lvlup** is a high-performance health and fitness application designed to remove the friction from personal optimization. By leveraging AI for diet logging and a rigorous "systems thinking" approach to strength training, lvlup transforms vague goals into measurable data.

---

## Key Features

### AI "Vision" Diet Engine

Stop manual typing. Simply snap a photo of your meal.

* **Automated Macros:** Uses Gemini-3-Flash to identify food items and estimate protein, carbs, and fats.
* **Indian Cuisine Optimized:** Built-in review system to adjust portions for complex meals like dals and curries.
* **Macro Rings:** Real-time visual tracking of remaining Kcal and Protein targets.

### Full-Spectrum Workout Engine (PPL)

A dedicated strength library focused on compound movements and high-intensity volume.

* **Push/Pull/Legs Logic:** Pre-programmed routines including Lat Pulldowns, Barbell Squats, and OHP with specific set/rep schemes (e.g., 4x12, 10, 8, 6).
* **Manual Override:** Log sets, reps, and weights for custom progressive overload.
* **Cardio & Core:** Integrated finishers including treadmill high-rise walks and core circuits.

### Data & Progress Tracking

* **Daily Weight Insights:** Interactive charts to visualize weight trends against your health plan.
* **Goal Streaks:** Visual indicators for consecutive days hitting your protein and calorie targets.
* **Visual Progress:** A private gallery for daily progress snaps to track body composition changes.
* **Smart Reminders:** Integrated hourly movement prompts and randomized hydration alerts.

---

## Tech Stack

* **Frontend:** React (Mobile-First PWA) / TypeScript
* **Styling:** Tailwind CSS (High-contrast "Neon & Dark" aesthetic)
* **Intelligence:** Google Gemini-3-Flash API (Multimodal Vision)
* **Storage/State:** IndexedDB / LocalStorage (Architecture ready for Firebase/Supabase integration)
* **Calculations:** Mifflin-St Jeor Engine for dynamic TDEE mapping.


---

## 📋 Roadmap

* [ ] **Wearable Integration:** Direct sync with Apple HealthKit and Google Fit.
* [ ] **Social Layer:** Shared "Goal Streaks" for accountability partners.
* [ ] **AI Coaching:** Predictive weight forecasting based on current calorie trends.

---

## ⚖️ Disclaimer

*lvlup is a tool for tracking and educational purposes. Always consult with a healthcare professional before starting a new diet or high-intensity lifting program.*

---


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1S1n5D44tUtpbNtj48b1-LoIJE4ZHGcn0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
