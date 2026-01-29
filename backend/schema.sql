-- Drop tables if they exist (Clean Slate for WIMS)
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS pipeline_entries CASCADE;
DROP TABLE IF EXISTS pipeline_stages CASCADE;
DROP TABLE IF EXISTS recruitment_pipelines CASCADE; -- Legacy
DROP TABLE IF EXISTS rounds CASCADE; -- Legacy
DROP TABLE IF EXISTS companies CASCADE; -- Legacy
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Users (Admin, Managers, Interns)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'manager', 'intern'
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

-- Pipeline Stages (Configurable Board)
CREATE TABLE pipeline_stages (
    id SERIAL PRIMARY KEY,
    stage_name VARCHAR(50) NOT NULL, -- "Screening", "Aptitude", "Technical", "HR"
    stage_order INTEGER NOT NULL
);

-- Pipeline Entries (Students on the Board)
CREATE TABLE pipeline_entries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    stage_id INTEGER REFERENCES pipeline_stages(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'passed', 'failed'
    interviewer_notes TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Offers
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
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
    assigned_to INTEGER REFERENCES students(id) ON DELETE CASCADE, -- The Intern (Student)
    assigned_by INTEGER REFERENCES users(id), -- The Manager
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20), -- 'low', 'med', 'high'
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done'
    score INTEGER, -- 0-100 (Grading)
    feedback TEXT, -- Manager feedback
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Initial Stages
INSERT INTO pipeline_stages (stage_name, stage_order) VALUES
('Screening', 1),
('Aptitude Test', 2),
('Technical Interview', 3),
('Managerial Round', 4),
('HR Round', 5);
