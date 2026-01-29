const axios = require('axios');
const pool = require('./config/database');

const testStatusUpdate = async () => {
    try {
        // 1. Get a student
        const res = await pool.query("SELECT id, name FROM students LIMIT 1");
        const student = res.rows[0];
        console.log(`Testing with student: ${student.name} (${student.id})`);

        // 2. Mock 'Rejected' stage ID (assuming 6 based on seed, but let's fetch)
        const stageRes = await pool.query("SELECT id FROM pipeline_stages WHERE stage_name = 'Rejected'");
        const rejectedId = stageRes.rows[0].id;

        // 3. Create a dummy pipeline entry for them
        const entryRes = await pool.query(
            "INSERT INTO pipeline_entries (student_id, stage_id) VALUES ($1, 1) RETURNING id",
            [student.id]
        );
        const entryId = entryRes.rows[0].id;

        // 4. Call API to move to Rejected
        console.log(`Moving entry ${entryId} to stage ${rejectedId}...`);
        await axios.put('http://localhost:5000/api/board/move', {
            entryId: entryId,
            targetStageId: rejectedId
        });

        // 5. Verify Student Status
        const check = await pool.query("SELECT status FROM students WHERE id = $1", [student.id]);
        console.log(`New Status: ${check.rows[0].status}`);

    } catch (err) {
        console.error("Status Test Failed:", err);
    } finally {
        // Cleanup - reset to Hired for continuity in other tests if needed
        // await pool.query("UPDATE students SET status = 'hired'"); 
        process.exit(0);
    }
};

testStatusUpdate();
