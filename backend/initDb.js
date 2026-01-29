const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema...');
        await pool.query(schemaSql);
        console.log('Schema applied successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    }
}

initDb();
