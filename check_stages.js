const pool = require('./backend/config/database');

const checkStages = async () => {
    try {
        const res = await pool.query('SELECT * FROM pipeline_stages ORDER BY id ASC');
        console.log('STAGES:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

checkStages();
