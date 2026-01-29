# 🦅 Wissen Intern Management System (WIMS) - Project Specification

## Project Overview
A premium, single-tenant full-stack application designed specifically for **Wissen** to streamline their entire internship lifecycle. The system automates the flow from **Resume Parsing** -> **Recruitment Pipeline** -> **Offer Rollout** -> **Intern Task Management**, wrapped in a high-end, futuristic UI.

---

## 💎 Premium UI/UX Vision (The "Wow" Factor)
*   **Aesthetic:** "Glassmorphism 2.0" - Deep frosted glass effects, vibrant gradients (Wissen Blue & Gold), and subtle noise textures.
*   **Interactions:** Liquid smooth transitions using `framer-motion`. Drag-and-drop elements should feel "weighty" and satisfying. 
*   **Dashboard:** A "Command Center" view for HR/Managers with real-time breathing charts and data visualization.
*   **Confetti & Celebration:** When a candidate accepts an offer, the dashboard should celebrate.
*   **Dark Mode First:** Designed primarily for dark mode with neon accents, but fully supports a crisp light mode.

---

## Tech Stack
- **Frontend**: React + Vite + **Tailwind CSS** + **Framer Motion** (Animations) + **shadcn/ui** (Base Components)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon DB)
- **AI Engine**: Google Gemini 1.5 Flash (for Resume Parsing & Candidate Scoring)
- **State Management**: Zustand / TanStack Query
- **Drag & Drop**: @dnd-kit/core

---

## 🚀 Core Workflows

### Phase 1: Intelligent Resume Processing
1.  **Bulk Upload**: Drag & drop 50+ resumes (PDF/DOCX) into the "Drop Zone".
2.  **AI Parsing**: Gemini extracts structured data (Name, Skills, XP, CGPA) + **Auto-scores** the candidate out of 100 based on Wissen's criteria.
3.  **One-Click Onboarding**: 
    *   Review parsed data.
    *   **Action:** Clicking "Approve" automatically creates a Student Profile AND adds them to the **"Screening"** stage of the Recruitment Pipeline.

### Phase 2: Visual Recruitment Pipeline
1.  **Kanban Board**: A Trello-style board with columns:
    *   *Applied / Screening* (Auto-populated from Phase 1)
    *   *Aptitude Test*
    *   *Technical Interview L1*
    *   *Managerial Round*
    *   *HR / Final Review*
2.  **Drag & Drop Navigation**: HR drags candidates between columns.
3.  **Status Triggers**:
    *   Drag to "Fail" bin -> Auto-email rejection (optional).
    *   Drag to "HR / Final Review" -> Prompts for final score.

### Phase 3: Automated Offer Management
1.  **Offer Trigger**: When a student enters the "Hired" state (or passes HR):
    *   System unlocks "Generate Offer" button.
2.  **Digital Offer Letter**:
    *   Auto-fills standard Wissen Template with Name, Stripe/Salary, Roles.
    *   Preview generated PDF.
3.  **Send**: Email sent to student with a unique tracked link.
4.  **Acceptance**: Student clicks "Accept" on their portal -> System auto-updates status to "Intern" and creates User Account.

### Phase 4: Intern Work & Task Management
1.  **Manager Dashboard**:
    *   "Assign Task": Rich text editor to describe work.
    *   "Priority": High/Med/Low tags.
2.  **Intern 'Cockpit'**:
    *   Interns log in to see their "Mission Control".
    *   Active Tasks, Deadlines, Progress Bars.
    *   Gamification: "XP" gained for completing tasks early.
3.  **Feedback Loop**: Manager approves/rejects work with comments.

---

## 📂 Database Schema (Single-Tenant: Wissen)

```sql
-- Users (Admin, Managers, Interns)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50), -- "admin", "manager", "intern"
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Students (Candidates)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    resume_url TEXT,
    skills TEXT[],
    ai_score INTEGER, -- 0-100
    parsed_json JSONB, -- Full AI data
    status VARCHAR(50) DEFAULT 'applied', -- 'applied', 'hired', 'rejected'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recruitment Pipeline (The Board)
CREATE TABLE pipeline_stages (
    id SERIAL PRIMARY KEY,
    stage_name VARCHAR(50), -- "Screening", "Aptitude", "Technical", "HR"
    stage_order INTEGER
);

CREATE TABLE pipeline_entries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    stage_id INTEGER REFERENCES pipeline_stages(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'passed', 'failed'
    interviewer_notes TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Offers
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    stipend_amount DECIMAL,
    role_title VARCHAR(100), -- e.g. "Software Intern"
    start_date DATE,
    offer_link_token VARCHAR(255),
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (Work Management)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    assigned_to INTEGER REFERENCES users(id), -- The Intern
    assigned_by INTEGER REFERENCES users(id), -- The Manager
    title VARCHAR(255),
    description TEXT,
    priority VARCHAR(20), -- 'low', 'med', 'high'
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done'
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🛣️ API Routes (Simplified)

### Resume & Intake
*   `POST /api/intake/upload` -> Validates & Stores files.
*   `POST /api/intake/parse` -> Calls Gemini -> Returns JSON.
*   `POST /api/intake/confirm` -> Saves Student -> **Creates Pipeline Entry (Stage 1)**.

### Recruitment Board
*   `GET /api/board` -> Returns all students grouped by Stage.
*   `PUT /api/board/move` -> `{ studentId, targetStageId }`.
*   `POST /api/board/feedback` -> Add interview notes.

### Offers
*   `POST /api/offer/generate` -> Creates PDF & Entry.
*   `POST /api/offer/send` -> Emails link.
*   `POST /api/offer/webhook/accept` -> Triggered by student action.

### Tasks
*   `GET /api/tasks` -> List tasks (filtered by user role).
*   `POST /api/tasks` -> Create new (Manager only).
*   `PATCH /api/tasks/:id/status` -> Drag & drop update.

---

## 🧠 Brainstormed "Power Features" for Wissen
1.  **"Galaxy View"**: A visual graph showing all interns and their connections to projects/managers. (Low Priority, high "Wow").
2.  **Daily Standup Bot**: Interns get a simple popup "What did you do today?" -> Compiles a report for the Manager.
3.  **Skill Radar**: After resume parsing, generate a "Radar Chart" comparing the candidate's skills vs Wissen's ideal profile.
4.  **Focus Mode**: When an intern is working on a task, they can toggle "Focus Mode" which plays lo-fi music and dims the interface (handled in frontend).

---

## Implementation Steps
1.  **Setup**: Initialize React (Vite) + Express + Postgres.
2.  **UI Core**: Build the `Layout` and `Sidebar` with premium glass styles.
3.  **Phase 1 (The Hook)**: Build the "Resume Upload" -> "Parsing" -> "Board" flow first. This is the core magic.
4.  **Phase 2 (The Manager)**: Build the automated Offer generation and Task Board.
5.  **Polish**: Add animations (Entrance effects, Hover states, Success confetti).

---
**Status**: Ready for Execution.
**Target**: Single Company (Wissen).