# PROJECT GUIDE — JEE Smart Planner (Simple Explanation)

This guide explains the project in plain, beginner-friendly language. You do not need to know coding to understand this.

---

## 1. What the Application Does

JEE Smart Planner is a website that helps students preparing for the JEE exam create a personalized study plan. Instead of guessing what to study each day, the student tells the app:

- Which subjects they are studying (Physics, Chemistry, Mathematics)
- Which chapters they are weak, average, or strong in
- Their recent mock-test scores
- How many hours they can study per day
- Their target exam and percentile

The app then creates a daily plan that tells them:
- Which chapter to study
- How much time to spend studying, practicing, and revising
- Why that chapter was given high, medium, or low priority

It also includes a mock-test analyzer, a progress dashboard, and a doubt classifier.

---

## 2. Main Features

### Landing Page (Home)
The first page visitors see. It has the app name, tagline, a "How it works" section (Assess → Analyze → Plan), a short explanation of the problem and solution, and two buttons: "Create My Study Plan" and "View Demo". The "View Demo" button loads demo data and takes you straight to the dashboard.

### Student Profile
This page has a form where the student enters their name, target exam, target percentile, daily study hours, and preparation level. Below that, there is a list of all chapters for Physics, Chemistry, and Mathematics. The student clicks "Weak", "Average", or "Strong" next to each chapter they want to include in their plan.

When they click "Save Profile & Generate Plan", the app saves their information and automatically creates a study plan. There is also a "Load Demo Data" button (fills in a sample student for presentations) and a "Clear All Data" button (resets everything).

### Study Planner
This page shows the generated daily plan. Each item in the plan shows:
- The subject and chapter name
- The priority level (HIGH, MEDIUM, or LOW)
- How many minutes to spend on study, practice, and revision
- A short explanation of why this priority was assigned

There is a "Regenerate Plan" button that creates a new plan using the same profile data. Students can also check off completed tasks by clicking the circle icon next to each item.

### Mock Test Analyzer
This page lets the student enter their mock-test scores (Physics, Chemistry, Mathematics, and maximum total). The app validates the input (no negative scores, total cannot exceed max). When they save, the app:
- Shows a bar chart of subject-wise performance
- Identifies their strongest and weakest subjects
- Shows a line chart of their score trend over time
- Gives improvement suggestions
- Saves the result so they can track progress
- Shows a history table where individual entries can be deleted

### Progress Dashboard
This page gives an overview of everything:
- How much time they studied today
- How many tasks they completed
- Their progress percentage
- Their weak and strong topics
- Their latest mock-test performance (bar chart)
- Their score trend (line chart)
- A donut chart showing how their study time is split between study, practice, and revision

### Doubt Classifier
This page lets the student type a question or doubt. The app tries to identify which subject (Physics, Chemistry, Mathematics) and which topic the doubt is about. It uses simple keyword matching — not a real AI model. It is honestly labeled as "AI-assisted doubt classification (prototype)".

### About Project
This page explains the problem, solution, how the system works, limitations, future improvements, and the technology used.

---

## 3. How the Priority Score Is Calculated

Each chapter gets a score from 0 to 100. A higher score means higher priority. The score is the sum of four parts:

| Part | Maximum Points | How It Works |
|------|----------------|--------------|
| Weakness Level | 40 | If the student marked the chapter as "weak", it gets 40 points. "Average" gets 20. "Strong" gets 5. |
| Recent Test Performance | 30 | If the student's recent mock-test score in that subject was low (below 40%), it gets 30 points. Moderate (40-70%) gets 15. High (above 70%) gets 3. |
| Chapter Importance | 20 | Each chapter has an importance rating from 1 to 10. The score is scaled: a rating of 10 gives 20 points, a rating of 5 gives 10 points. |
| Available Study Time | 10 | If the student has 6+ hours per day, it gets 10 points. 4-5 hours gets 7. Less than 4 hours gets 4. |

The total score (out of 100) determines the label:
- **60-100 = HIGH priority**
- **35-59 = MEDIUM priority**
- **0-34 = LOW priority**

The app also creates a sentence explaining the score, like:
> "HIGH priority because you marked this chapter as weak, your recent Physics score was low (38%), and this chapter is highly important for JEE."

This is **not** a scientifically perfect prediction — it is a simple, transparent scoring system.

---

## 4. How Mock-Test Analysis Works

1. The student enters their Physics, Chemistry, and Mathematics scores, plus the maximum total (default 300).
2. The app checks that all values are valid numbers, not negative, and that the total of the three subjects does not exceed the maximum.
3. The app calculates the total score by adding the three subjects.
4. The result is saved to local storage with a date stamp.
5. The app shows:
   - A **bar chart** comparing the latest Physics, Chemistry, and Math scores
   - The **strongest subject** (highest average across all saved tests)
   - The **weakest subject** (lowest average)
   - A **line chart** showing how the total score changed over multiple tests
   - **Improvement suggestions** based on the scores and trends
6. All past results are shown in a table, and the student can delete any entry.

---

## 5. How Doubt Classification Works

The doubt classifier uses **keyword matching**. Here is how:

1. The student types their doubt or question.
2. The app converts the text to lowercase.
3. It checks the text against a list of keywords for each topic. For example:
   - "velocity", "acceleration", "projectile" → Physics / Kinematics
   - "mole", "stoichiometry", "avogadro" → Chemistry / Mole Concept
   - "quadratic", "roots", "discriminant" → Mathematics / Quadratic Equations
4. The topic with the most matching keywords wins.
5. The app shows the subject, likely topic, confidence level (Low/Medium/High based on how many keywords matched), and the matched keywords.
6. If no keywords match, it returns "Unknown".

This is clearly labeled as a prototype. It is **not** a real AI model — it is a simple rule-based system.

---

## 6. Where Data Is Stored

All data is stored in the **browser's local storage** under a unique application namespace (`jee_smart_planner_v1`). This means:
- The data stays on the student's device
- It survives page refreshes
- It does not require any paid database or server
- Clearing the browser's data will erase everything
- **It is NOT shared with other applications** — the app only reads and writes its own keys

The app stores five things in local storage:
1. **Student profile** (name, exam, chapters, etc.)
2. **Mock test results** (list of all saved test scores)
3. **Study plan** (the current generated plan)
4. **Completed tasks** (which plan items the student checked off)
5. **Doubt history** (previously classified doubts)

You can clear all data at any time using the "Clear All Data" button on the Profile page. This **only** removes this app's data — it never touches unrelated browser data.

### Demo Mode vs Real User Data

The app has a **Demo Mode** that lets you explore the app with sample data without permanently overwriting your real data:

- When you click "View Demo" or "Load Demo Data", the app **backs up** your real data first, then loads demo data.
- A "Demo" badge appears in the navigation bar so you know you are in demo mode.
- When you click "Exit Demo" (in the navbar or on the Profile page), the app **restores your real data** from the backup. Demo data is discarded.
- If a new user saves their own profile while in demo mode, the app automatically exits demo mode and restores their real data first, then saves the new profile.
- Demo data is clearly labeled with the name "Demo Student" — no real person's name is used.

### Data Isolation Between Users

Because this is a **browser-based prototype** (no backend database), data isolation works at the **browser level**:

- Each browser has its own separate local storage. Data is **not shared** between different browsers or different devices.
- Within the same browser, all data belongs to the current user session. There is no multi-account login system — switching users means clearing data and creating a new profile.
- "Clear All Data" removes only this app's stored data, not data from other websites or apps.

### Limitation: No Multi-Device or Multi-Account Sync

This prototype uses browser local storage only. It does **not** provide:
- **Account-based authentication** — there is no login, password, or user account system.
- **Multi-device synchronization** — data entered on one device/browser is not visible on another.
- **True multi-user support** — multiple users on the same browser share the same data store.

If true multi-device/multi-account synchronization is needed in the future, a backend database with user authentication (such as Supabase) would be required. This is a known limitation of the current prototype.

---

## 7. Which Files Contain the Important Logic

Here is where the key logic lives:

| File | What It Does |
|------|-------------|
| `src/lib/priority.ts` | Calculates priority scores and generates the study plan |
| `src/lib/storage.ts` | Saves and loads data from browser local storage |
| `src/lib/doubtClassifier.ts` | Classifies student doubts using keyword matching |
| `src/lib/demoData.ts` | Creates realistic demo data for presentations |
| `src/data/chapters.ts` | The list of all chapters for Physics, Chemistry, and Math with importance ratings |
| `src/types.ts` | Defines the data shapes (what a student profile looks like, what a plan item looks like, etc.) |
| `src/pages/Landing.tsx` | The landing page with hero, how it works, and features |
| `src/pages/Profile.tsx` | The student profile form page |
| `src/pages/Planner.tsx` | The study plan page with task completion |
| `src/pages/MockTest.tsx` | The mock-test analyzer page |
| `src/pages/Dashboard.tsx` | The progress dashboard page |
| `src/pages/DoubtClassifier.tsx` | The doubt classifier page |
| `src/pages/About.tsx` | The about page with problem, solution, how it works, limitations, and future improvements |
| `src/components/Charts.tsx` | The bar chart, line chart, and donut chart components |
| `src/components/Navbar.tsx` | The navigation bar |
| `src/App.tsx` | The main app file that ties everything together |

---

## 8. What Could Be Improved in the Future

Here are some ideas for making the app better in the future:

1. **Add cloud sync** — Let students log in and sync their data across devices using a cloud database.
2. **Use a real AI model** — Replace the keyword-based doubt classifier with an actual AI API for better accuracy.
3. **Add a timer** — Let students start a timed study session for each task, like a Pomodoro timer.
4. **Add practice questions** — Include a small question bank so students can practice directly in the app.
5. **Add streaks and rewards** — Track how many days in a row the student completed their plan, and show badges.
6. **Export to PDF** — Let students download their study plan as a PDF file.
7. **Add more analytics** — Show weekly and monthly study trends, not just daily.
8. **Support JEE Advanced** — Add separate planning for JEE Advanced with different chapter importance ratings.

---

Remember: This is an educational prototype. The recommendations are helpful suggestions, not guarantees. The app is meant to help students think about their preparation more strategically.
