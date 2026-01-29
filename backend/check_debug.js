const pool = require('./config/database');

const runDebug = async () => {
    try {
        console.log("--- Checking Stages ---");
        const stages = await pool.query('SELECT * FROM pipeline_stages ORDER BY id');
        console.log(stages.rows);

        console.log("\n--- Checking Student Columns ---");
        const cols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'students'
        `);
        console.log(cols.rows.map(c => `${c.column_name} (${c.data_type})`));

    } catch (err) {
        console.error("Debug Error:", err);
    } finally {
        // We generally shouldn't end the pool if it's shared, but for a script it's fine.
        // However, require('./config/database') exports a pool instance.
        // We can't easily end it if the export doesn't expose .end(), but pool usually has .end()
        process.exit(0);
    }
};

runDebug();
