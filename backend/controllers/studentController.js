const pool = require('../config/database');
const { parseResumeWithGemini } = require('../services/geminiService');
const { extractTextFromPdf, extractTextFromDocx } = require('../services/pdfParser');

exports.uploadResumes = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const results = [];

        for (const file of req.files) {
            let text = '';
            try {
                if (file.mimetype === 'application/pdf') {
                    text = await extractTextFromPdf(file.buffer);
                } else if (
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    file.mimetype === 'application/msword'
                ) {
                    text = await extractTextFromDocx(file.buffer);
                } else {
                    results.push({
                        filename: file.originalname,
                        status: 'failed',
                        error: 'Unsupported file type'
                    });
                    continue;
                }

                const parsedData = await parseResumeWithGemini(text);
                results.push({
                    filename: file.originalname,
                    status: 'success',
                    data: parsedData
                });

            } catch (error) {
                console.error(`Error processing file ${file.originalname}:`, error);
                results.push({
                    filename: file.originalname,
                    status: 'failed',
                    error: error.message
                });
            }
        }

        console.log(`Upload complete. Sending results for ${results.length} files.`);
        console.log("Results payload:", JSON.stringify({ results }, null, 2));
        res.json({ results });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};

exports.saveStudents = async (req, res) => {
    const { students } = req.body; // Array of student objects

    if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertedStudents = [];
        const errors = [];

        for (const student of students) {
            try {
                const { name, email, phone, skills, education, experience, parsed_data } = student;

                const query = `
          INSERT INTO students (name, email, phone, skills, education, experience, parsed_data)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;

                const values = [
                    name,
                    email,
                    phone,
                    skills,
                    JSON.stringify(education),
                    JSON.stringify(experience),
                    parsed_data
                ];

                const result = await client.query(query, values);
                insertedStudents.push(result.rows[0]);
            } catch (err) {
                console.error(`Error saving student ${student.email}:`, err);
                errors.push({ email: student.email, error: err.message });
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, inserted: insertedStudents.length, errors });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Database transaction failed' });
    } finally {
        client.release();
    }
};

exports.getAllStudents = async (req, res) => {
    const { status } = req.query;
    try {
        let query = 'SELECT * FROM students';
        const params = [];

        if (status) {
            // Support comma-separated statuses e.g. ?status=hired,offered
            const statuses = status.split(',');
            query += ' WHERE status = ANY($1)';
            params.push(statuses);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Get Students Error:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};
