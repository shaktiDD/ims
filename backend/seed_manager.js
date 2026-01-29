const pool = require('./config/database');

const seedManager = async () => {
    try {
        // Check if admin exists
        const res = await pool.query("SELECT * FROM users WHERE email = 'admin@wims.com'");
        if (res.rows.length === 0) {
            await pool.query(
                "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, $3, $4)",
                ['admin@wims.com', 'nopassword', 'manager', 'Admin User']
            );
            console.log("Seeded Manager: admin@wims.com");
        } else {
            console.log("Manager already exists.");
        }
    } catch (err) {
        console.error("Seed Failed:", err);
    } finally {
        process.exit(0);
    }
};

seedManager();
