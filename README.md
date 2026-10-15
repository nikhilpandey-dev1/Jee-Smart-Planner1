# JEE Smart Planner

**Study smarter. Focus on what matters most.**

JEE Smart Planner is a web application that helps JEE students create a personalized daily study plan based on their subjects, weak and strong chapters, mock-test performance, and available study time.

---

## Problem Statement

JEE students often know what they need to study but struggle to decide what to prioritize. With dozens of chapters across Physics, Chemistry, and Mathematics, and limited daily study time, building an effective study plan is difficult without guidance.

## Solution

JEE Smart Planner uses student performance and self-assessment data to create a personalized study plan. It combines:

- **Chapter weakness level** (self-assessed by the student)
- **Recent mock-test performance** (subject-wise scores)
- **Chapter importance** (how frequently a chapter appears in JEE)
- **Available daily study time**

The app generates a daily plan with study time, practice time, and revision time for each chapter, along with a transparent explanation of why each topic was prioritized.

## Features

1. **Landing Page** — Professional introduction with "How it works" (Assess → Analyze → Plan), problem/solution sections, and feature overview.
2. **Student Profile** — Form to enter name, target exam, target percentile, daily study hours, preparation level, and self-assess chapters as weak/average/strong. Includes "Load Demo Data" and "Clear All Data" buttons.
3. **Study Planner** — Generates a personalized daily plan with subject, chapter, priority (HIGH/MEDIUM/LOW), study time, practice time, and revision time. Includes a "Regenerate Plan" button and task completion checkboxes.
4. **Priority Algorithm** — Transparent scoring system (0-100) with human-readable explanations for each priority assignment.
5. **Mock Test Analyzer** — Enter physics, chemistry, math, and total scores with input validation. Shows subject-wise performance, strongest/weakest subjects, improvement suggestions, performance charts, and saves multiple results.
6. **Progress Dashboard** — Shows today's plan, completed tasks, total study time, mock-test performance, weak/strong topics, and progress percentage with charts.
7. **Doubt Classifier** — AI-assisted doubt classification (prototype) using rule-based keyword matching. Honestly labeled — does not claim to be a real AI model.
8. **Demo Data** — One-click "Load Demo Data" button for presentations. "View Demo" on the landing page loads demo data and navigates to the dashboard.
9. **Responsive Design** — Works on mobile, tablet, and desktop.
10. **Local Storage** — All data persists in the browser. No paid services required.

## Technology Used

- **React** — UI framework
- **TypeScript** — Type-safe JavaScript
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **Lucide React** — Icon library
- **Browser LocalStorage** — Data persistence (no database required)

## How the Priority Algorithm Works

Each chapter receives a **priority score from 0 to 100** based on four factors:

| Factor | Max Points | Explanation |
|--------|-----------|-------------|
| Weakness Level | 40 | Weak = 40, Average = 20, Strong = 5 |
| Recent Test Performance | 30 | Score < 40% = 30, 40-70% = 15, > 70% = 3 |
| Chapter Importance | 20 | Scaled from 1-10 importance rating |
| Available Study Time | 10 | More hours = more chapters can be covered |

The total score determines the priority label:
- **HIGH** (60-100): Focus on these first
- **MEDIUM** (35-59): Important but not urgent
- **LOW** (0-34): Maintain with light practice

The app also generates a human-readable reason for each priority, e.g.:
> "HIGH priority because you marked this chapter as weak, your recent Physics score was low (38%), and this chapter is highly important for JEE."

Time allocation per chapter:
- **50% Study** (learning/reviewing concepts)
- **30% Practice** (solving problems)
- **20% Revision** (reviewing what was studied)

## How the Mock Test Analyzer Works

1. Student enters Physics, Chemistry, Mathematics scores and the maximum total.
2. Input is validated: no negative scores, no non-numeric values, total cannot exceed max.
3. The app saves the result to local storage with a timestamp.
4. The analyzer calculates:
   - **Subject-wise performance** (bar chart of latest scores)
   - **Strongest subject** (highest average across all tests)
   - **Weakest subject** (lowest average)
   - **Score trend** (line chart of total scores over time)
   - **Improvement suggestions** (based on performance and trends)
5. Multiple test results can be saved and reviewed in a history table. Individual entries can be deleted.

## How the Doubt Classifier Works

The doubt classifier uses **rule-based keyword matching** — honestly labeled as a prototype, not a real AI model.

1. The student types their doubt or question.
2. The app converts the text to lowercase.
3. It checks the text against a list of keywords for each topic (e.g., "velocity" → Physics/Kinematics, "mole" → Chemistry/Mole Concept, "quadratic" → Mathematics/Quadratic Equations).
4. The topic with the most matching keywords wins.
5. The app shows the subject, likely topic, confidence level (Low/Medium/High), and matched keywords.
6. If no keywords match, it returns "Unknown".

## Limitations

- This is an **educational prototype**. Recommendations are not guaranteed to improve exam performance.
- The priority algorithm uses a **simple transparent scoring system**, not a scientifically validated model.
- The doubt classifier uses **keyword matching**, not a real AI/ML model.
- All data is stored **locally in the browser** — clearing browser data will erase everything.
- The app does not connect to any external API or paid service.

## Future Improvements

- Add cloud sync so students can access their plan across devices
- Integrate a real AI model for more accurate doubt classification
- Add timed study sessions with a Pomodoro timer
- Include chapter-wise question banks for in-app practice
- Add streak tracking, badges, and weekly/monthly analytics
- Export study plans as PDF for offline reference

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, Charts)
├── data/           # Chapter data for Physics, Chemistry, Math
├── lib/            # Core logic (storage, priority, doubt classifier, demo data)
├── pages/          # Application pages
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main app with navigation
├── main.tsx         # React entry point
└── index.css        # Global styles
```
