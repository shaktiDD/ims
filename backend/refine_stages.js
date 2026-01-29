const pool = require('./config/database');

const refineStages = async () => {
    try {
        console.log("Refining Stages...");

        // 1. Get ID of 'Offered' and 'Interview'
        const offeredRes = await pool.query("SELECT id FROM pipeline_stages WHERE stage_name = 'Offered'");
        const interviewRes = await pool.query("SELECT id FROM pipeline_stages WHERE stage_name = 'Interview'");

        if (offeredRes.rows.length > 0 && interviewRes.rows.length > 0) {
            const offeredId = offeredRes.rows[0].id;
            const interviewId = interviewRes.rows[0].id;

            // 2. Move candidates from Offered to Interview (Safe Fallback)
            await pool.query("UPDATE pipeline_entries SET stage_id = $1 WHERE stage_id = $2", [interviewId, offeredId]);
            console.log("Moved candidates from Offered to Interview.");

            // 3. Delete Offered Stage
            await pool.query("DELETE FROM pipeline_stages WHERE id = $1", [offeredId]);
            console.log("Deleted 'Offered' stage.");
        } else {
            console.log("Stages not found or already cleaned.");
        }

    } catch (err) {
        console.error("Stage Refinement Error:", err);
    } finally {
        process.exit(0);
    }
};

refineStages();
