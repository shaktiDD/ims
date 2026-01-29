const pool = require('../config/database');

// Create a Task (Bulk Assign supported)
const createTask = async (req, res) => {
    const { studentIds, title, description, priority, dueDate } = req.body;

    // Validate required
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0 || !title) {
        return res.status(400).json({ error: "At least one Student ID and Title are required" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const tasks = [];

        const query = `
            INSERT INTO tasks (assigned_to, title, description, priority, due_date, status)
            VALUES ($1, $2, $3, $4, $5, 'todo')
            RETURNING *;
        `;

        for (const studentId of studentIds) {
            const finalDueDate = dueDate || null; // Handle empty string
            const result = await client.query(query, [studentId, title, description, priority, finalDueDate]);
            tasks.push(result.rows[0]);
        }

        await client.query('COMMIT');
        res.json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Create Task Error:", error);
        res.status(500).json({ error: "Failed to create tasks" });
    } finally {
        client.release();
    }
};

// Get Tasks (optionally filter by studentId)
const getTasks = async (req, res) => {
    const { studentId } = req.query;
    try {
        let query = 'SELECT t.*, s.name as student_name FROM tasks t JOIN students s ON t.assigned_to = s.id';
        let params = [];

        if (studentId) {
            query += ' WHERE t.assigned_to = $1';
            params.push(studentId);
        }

        query += ' ORDER BY t.created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Get Tasks Error:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
    const { taskId, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, taskId]
        );
        res.json({ success: true, task: result.rows[0] });
    } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
};

// Grade a Task (Manager only)
const gradeTask = async (req, res) => {
    const { taskId, score, feedback } = req.body;

    // Validate
    if (score < 0 || score > 100) {
        return res.status(400).json({ error: "Score must be between 0 and 100" });
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET score = $1, feedback = $2 WHERE id = $3 RETURNING *',
            [score, feedback, taskId]
        );
        res.json({ success: true, task: result.rows[0] });
    } catch (error) {
        console.error("Grade Task Error:", error);
        res.status(500).json({ error: "Failed to grade task" });
    }
};

module.exports = { createTask, getTasks, updateTaskStatus, gradeTask };
