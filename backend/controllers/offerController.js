const pool = require('../config/database');
const crypto = require('crypto');

// Create a new Offer
const createOffer = async (req, res) => {
    const { studentId, stipend, role, startDate } = req.body;

    if (!studentId || !stipend || !role || !startDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Generate unique token for the offer letter link (future use)
        const token = crypto.randomBytes(32).toString('hex');

        // 2. Insert into offers table
        const insertQuery = `
            INSERT INTO offers (student_id, stipend_amount, role_title, start_date, offer_link_token)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await client.query(insertQuery, [studentId, stipend, role, startDate, token]);
        const offer = result.rows[0];

        // 3. Update Student Status
        await client.query('UPDATE students SET status = $1 WHERE id = $2', ['offered', studentId]);

        // 4. Update Pipeline Status (Optional but good for tracking)
        // We might want to move them to a "Hired" or "Offered" stage if one existed, 
        // but for now we just update top-level student status.

        await client.query('COMMIT');

        res.json({ success: true, offer });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Create Offer Error:", error);
        res.status(500).json({ error: "Failed to create offer" });
    } finally {
        client.release();
    }
};

// Get Offers for a Student
const getOffers = async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM offers WHERE student_id = $1 ORDER BY created_at DESC', [studentId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Get Offers Error:", error);
        res.status(500).json({ error: "Failed to fetch offers" });
    }
};

module.exports = { createOffer, getOffers };
