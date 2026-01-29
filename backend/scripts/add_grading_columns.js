const pool = require('../config/database');

async function migrate() {
    console.log("Starting Migration: Add Grading Columns...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Adding score column...");
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS score INTEGER;');

        console.log("Adding feedback column...");
        await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS feedback TEXT;');

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
