const pool = require('../config/database');

// Intern Login (Email Only)
const internLogin = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Intern not found. Please uploading your resume first." });
        }

        const student = result.rows[0];

        // Return user object (Simulating a token for now)
        res.json({
            success: true,
            user: {
                id: student.id,
                name: student.name,
                email: student.email,
                role: 'intern'
            }
        });
    } catch (err) {
        console.error("Intern Login Error:", err);
        res.status(500).json({ error: "Login failed" });
    }
};

// Manager Login (Email Only)
const managerLogin = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND role = 'manager'", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Manager not found." });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: 'manager'
            }
        });
    } catch (err) {
        console.error("Manager Login Error:", err);
        res.status(500).json({ error: "Login failed" });
    }
};

module.exports = { internLogin, managerLogin };
