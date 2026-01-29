const pool = require('../config/database');

const getLeaderboard = async (req, res) => {
    try {
        // Calculate average score for completed tasks
        const query = `
            SELECT 
                s.id, 
                s.name, 
                s.email, 
                COUNT(t.id) as tasks_completed, 
                ROUND(AVG(t.score), 1) as average_score
            FROM students s
            JOIN tasks t ON s.id = t.assigned_to
            WHERE t.status = 'done' AND t.score IS NOT NULL
            GROUP BY s.id
            ORDER BY average_score DESC, tasks_completed DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};

module.exports = { getLeaderboard };
