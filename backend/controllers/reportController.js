const pool = require('../config/database');
const { generateReportWithGemini } = require('../services/geminiService');

const generateReport = async (req, res) => {
    const { studentId } = req.body;

    try {
        // 1. Fetch Student Data
        const studentRes = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
        const student = studentRes.rows[0];

        if (!student) return res.status(404).json({ error: "Student not found" });

        // 2. Fetch Completed Tasks
        const tasksRes = await pool.query(
            "SELECT title, score, feedback FROM tasks WHERE assigned_to = $1 AND status = 'done' AND score IS NOT NULL",
            [studentId]
        );
        const tasks = tasksRes.rows;

        // 3. Calculate Avg Score
        const avgScore = tasks.length > 0
            ? (tasks.reduce((sum, t) => sum + t.score, 0) / tasks.length).toFixed(1)
            : 0;

        // 4. Generate with Gemini
        const report = await generateReportWithGemini(student.name, tasks, avgScore);

        res.json({ report });

    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
};

const sendReportEmail = async (req, res) => {
    const { email, report } = req.body;

    // SIMULATED EMAIL SENDING
    console.log(`\n--- [DUMMY EMAIL SERVICE] ---`);
    console.log(`To: ${email}`);
    console.log(`Subject: Performance Review`);
    console.log(`Body Length: ${report?.length || 0} chars`);
    console.log(`Action: SUCCESS`);
    console.log(`-----------------------------\n`);

    // Simulate network delay
    setTimeout(() => {
        res.json({ success: true, message: "Email sent successfully (simulated)" });
    }, 1000);
};

module.exports = { generateReport, sendReportEmail };
