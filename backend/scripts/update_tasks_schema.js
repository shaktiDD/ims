const pool = require('../config/database');

async function migrate() {
    console.log("Starting Migration: Update Tasks Table...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Dropping old tasks table...");
        await client.query('DROP TABLE IF EXISTS tasks CASCADE');

        console.log("Creating new tasks table...");
        await client.query(`
            CREATE TABLE tasks (
                id SERIAL PRIMARY KEY,
                assigned_to INTEGER REFERENCES students(id) ON DELETE CASCADE,
                assigned_by INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                priority VARCHAR(20),
                status VARCHAR(50) DEFAULT 'todo',
                due_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await client.query('COMMIT');
        console.log("Migration Successful!");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Migration Failed:", error);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
