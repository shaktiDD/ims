const pool = require('./config/database');

const fixStatus = async () => {
    try {
        await pool.query("UPDATE students SET status = 'hired'");
        console.log("Updated all students to 'hired'");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

fixStatus();
