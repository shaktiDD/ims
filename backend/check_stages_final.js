const pool = require('./config/database');

const check = async () => {
    const res = await pool.query("SELECT * FROM pipeline_stages");
    console.log(res.rows);
    process.exit(0);
};

check();
