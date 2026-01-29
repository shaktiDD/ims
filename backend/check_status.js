const pool = require('./config/database');

const checkStatus = async () => {
    try {
        const res = await pool.query('SELECT id, name, status FROM students');
        console.log('Students:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

checkStatus();
