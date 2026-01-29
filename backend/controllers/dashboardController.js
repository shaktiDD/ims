const pool = require('../config/database');

const getStats = async (req, res) => {
    try {
        const client = await pool.connect();

        // Parallel queries for speed
        const [
            applicantsRes,
            hiredRes,
            internsRes,
            pendingGradingRes
        ] = await Promise.all([
            client.query("SELECT COUNT(*) FROM students WHERE status = 'applied'"),
            client.query("SELECT COUNT(*) FROM students WHERE status IN ('hired', 'offered')"),
            client.query("SELECT COUNT(*) FROM students WHERE status = 'hired'"), // Assuming 'hired' is the active intern status
            client.query("SELECT COUNT(*) FROM tasks WHERE status = 'done' AND score IS NULL")
        ]);

        client.release();

        res.json({
            applicants: parseInt(applicantsRes.rows[0].count),
            hired: parseInt(hiredRes.rows[0].count),
            activeInterns: parseInt(internsRes.rows[0].count),
            pendingGrading: parseInt(pendingGradingRes.rows[0].count)
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};

const getFunnelData = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT status, COUNT(*) as count 
            FROM students 
            GROUP BY status
        `);

        // Format for frontend chart
        // Ensure specific order: Applied -> Interview -> Offer -> Hired
        const counts = result.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, {});

        const funnel = [
            { name: 'Applied', value: counts['applied'] || 0, fill: '#60a5fa' }, // Blue
            { name: 'Interview', value: counts['interview'] || 0, fill: '#fbbf24' }, // Yellow
            { name: 'Offered', value: counts['offered'] || 0, fill: '#a78bfa' }, // Purple
            { name: 'Hired', value: counts['hired'] || 0, fill: '#4ade80' } // Green
        ];

        res.json(funnel);

    } catch (error) {
        console.error("Dashboard Funnel Error:", error);
        res.status(500).json({ error: "Failed to fetch funnel data" });
    }
};

module.exports = { getStats, getFunnelData };
