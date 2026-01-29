const fs = require('fs');
const pool = require('../config/database');
const { parseResumeWithGemini } = require('../services/geminiService');
const { extractTextFromPdf, extractTextFromDocx } = require('../services/pdfParser');

const parseResume = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const parsedResults = [];

        for (const file of req.files) {
            let text = "";
            try {
                // Extract Text
                if (file.mimetype === "application/pdf") {
                    const buffer = fs.readFileSync(file.path);
                    text = await extractTextFromPdf(buffer);
                } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const buffer = fs.readFileSync(file.path);
                    text = await extractTextFromDocx(buffer);
                } else {
                    console.log(`Unsupported file type: ${file.mimetype}`);
                    continue;
                }

                // Call Ported Gemini Service
                const parsedData = await parseResumeWithGemini(text);

                parsedResults.push({
                    originalName: file.originalname,
                    data: parsedData
                });

            } catch (innerError) {
                console.error(`Error processing ${file.originalname}:`, innerError);
                // Optionally push an error object to results so frontend knows
                parsedResults.push({
                    originalName: file.originalname,
                    error: innerError.message
                });
            } finally {
                // Clean up file
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        res.json({ success: true, results: parsedResults });

    } catch (error) {
        console.error("Parsing Error:", error);
        res.status(500).json({ error: "Failed to parse resumes", details: error.message });
    }
};

const confirmCandidates = async (req, res) => {
    // This logic remains from WIMS implementation to match new schema
    const client = await pool.connect();
    try {
        const { candidates } = req.body;

        await client.query('BEGIN');

        for (const candidate of candidates) {
            if (!candidate.name) continue; // Skip failed parses

            const studentRes = await client.query(
                `INSERT INTO students (name, email, phone, skills, ai_score, parsed_json, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, 'applied') 
                 RETURNING id`,
                [candidate.name, candidate.email, candidate.phone, candidate.skills, candidate.wissen_score || 0, candidate]
            );
            const studentId = studentRes.rows[0].id;

            await client.query(
                `INSERT INTO pipeline_entries (student_id, stage_id, status)
                 VALUES ($1, 1, 'pending')`,
                [studentId]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, message: `${candidates.length} candidates onboarded successfully.` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Onboarding Error:", error);
        res.status(500).json({ error: "Failed to onboard candidates" });
    } finally {
        client.release();
    }
};

module.exports = { parseResume, confirmCandidates };
