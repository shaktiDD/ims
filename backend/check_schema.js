const pool = require('./config/database');

const checkSchema = async () => {
    try {
        console.log("Checking 'students' columns:");
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'students'
        `);
        res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

        console.log("\nChecking 'pipeline_entries' columns:");
        const res2 = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'pipeline_entries'
        `);
        res2.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

checkSchema();
