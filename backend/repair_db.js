const pool = require('./config/database');

const repair = async () => {
    try {
        console.log("Starting DB Repair...");

        // 0. Create users & students
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) NOT NULL,
                full_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                resume_url TEXT,
                skills TEXT[],
                ai_score INTEGER,
                parsed_json JSONB,
                status VARCHAR(50) DEFAULT 'applied',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Verified users & students tables.");

        // 1. Create pipeline_stages
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipeline_stages (
                id SERIAL PRIMARY KEY,
                stage_name VARCHAR(50) NOT NULL,
                stage_order INTEGER NOT NULL
            );
        `);
        console.log("Verified pipeline_stages table.");

        // 2. Seed Stages (Idempotent)
        const stages = [
            'Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'
        ];

        for (let i = 0; i < stages.length; i++) {
            const name = stages[i];
            const check = await pool.query('SELECT * FROM pipeline_stages WHERE stage_name = $1', [name]);
            if (check.rows.length === 0) {
                await pool.query('INSERT INTO pipeline_stages (stage_name, stage_order) VALUES ($1, $2)', [name, i + 1]);
                console.log(`Seeded stage: ${name}`);
            }
        }

        // 3. Create pipeline_entries
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipeline_entries (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                stage_id INTEGER REFERENCES pipeline_stages(id),
                status VARCHAR(50) DEFAULT 'pending',
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 4. Create offers & tasks
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offers (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                stipend_amount DECIMAL,
                role_title VARCHAR(100),
                start_date DATE,
                offer_link_token VARCHAR(255),
                status VARCHAR(50) DEFAULT 'sent',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                assigned_to INTEGER REFERENCES students(id) ON DELETE CASCADE,
                assigned_by INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                priority VARCHAR(20),
                status VARCHAR(50) DEFAULT 'todo',
                score INTEGER,
                feedback TEXT,
                due_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Verified offers & tasks tables.");
        console.log("Verified pipeline_entries table.");

        console.log("Repair Complete!");

    } catch (err) {
        console.error("Repair Failed:", err);
    } finally {
        process.exit(0);
    }
};

repair();
