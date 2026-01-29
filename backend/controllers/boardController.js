const pool = require('../config/database');

// Get Board Data (Stages + Candidates)
const getBoard = async (req, res) => {
    try {
        // 1. Fetch Stages
        const stagesRes = await pool.query('SELECT * FROM pipeline_stages ORDER BY stage_order ASC');
        const stages = stagesRes.rows;

        // 2. Fetch Candidates in Pipeline
        const entriesRes = await pool.query(`
            SELECT 
                pe.id as entry_id,
                pe.stage_id,
                pe.status as entry_status,
                s.id as student_id,
                s.name,
                s.email,
                s.ai_score,
                s.skills
            FROM pipeline_entries pe
            JOIN students s ON pe.student_id = s.id
        `);
        const entries = entriesRes.rows;

        // 3. Structure Data for Frontend: { [stageId]: [candidates] }
        // We will send stages and entries separately, frontend helps structure it.

        res.json({
            stages,
            entries
        });

    } catch (error) {
        console.error("Get Board Error:", error);
        res.status(500).json({ error: "Failed to fetch board data" });
    }
};

// Move Candidate
const moveCandidate = async (req, res) => {
    const { entryId, targetStageId } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Move in Pipeline
        await client.query(
            'UPDATE pipeline_entries SET stage_id = $1, updated_at = NOW() WHERE id = $2 RETURNING student_id',
            [targetStageId, entryId]
        );

        // 2. Get Student ID & Target Stage Name
        const entryRes = await client.query('SELECT student_id FROM pipeline_entries WHERE id = $1', [entryId]);
        const studentId = entryRes.rows[0].student_id;

        const stageRes = await client.query('SELECT stage_name FROM pipeline_stages WHERE id = $1', [targetStageId]);
        const stageName = stageRes.rows[0].stage_name.trim();

        // 3. Update Student Status based on Stage
        let newStatus = null;
        if (stageName === 'Offered') newStatus = 'offered';
        else if (stageName === 'Hired') newStatus = 'hired';
        else if (stageName === 'Rejected') newStatus = 'rejected';

        if (newStatus) {
            await client.query('UPDATE students SET status = $1 WHERE id = $2', [newStatus, studentId]);
        }

        await client.query('COMMIT');
        res.json({ success: true, stageName }); // Return stage name to help frontend
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Move Candidate Error:", error);
        res.status(500).json({ error: "Failed to move candidate" });
    } finally {
        client.release();
    }
};

module.exports = { getBoard, moveCandidate };
