const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseResumePrompt = `
Parse this resume text and extract the following information in JSON format:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "skills": ["skill1", "skill2", ...],
  "wissen_score": 85, 
  "summary": "Short professional summary",
  "experience_years": 0,
  "education": {
    "degree": "degree name",
    "university": "university name",
    "cgpa": "cgpa or percentage",
    "graduation_year": "year"
  },
  "experience": [
    {
      "company": "company name",
      "role": "job title",
      "duration": "duration of employment"
    }
  ]
}

If any field is missing, return null or an empty string/array as appropriate. Ensure the output is strictly valid JSON without any markdown formatting.
Also, give a "wissen_score" (0-100) based on how well they fit a Full Stack Developer role (React/Node/SQL).

Resume text:
`;

exports.parseResumeWithGemini = async (resumeText) => {
  try {
    // Updated model name - use one of these:
    // "gemini-1.5-flash" (faster, cheaper)
    // "gemini-1.5-pro" (more capable)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    console.log("Calling Gemini API with model: gemini-flash-latest");
    const result = await model.generateContent(parseResumePrompt + resumeText);
    console.log("Gemini response received, waiting for text...");
    const response = await result.response;
    const text = response.text();
    console.log("Gemini text received:", text.substring(0, 100) + "...");

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw new Error("Failed to parse resume with Gemini");
  }
};

exports.generateReportWithGemini = async (studentName, tasks, avgScore) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
            Act as a Senior Engineering Manager. Write a formal End-of-Internship Performance Review for an intern named "${studentName}".
            
            Data:
            - Average Task Score: ${avgScore}/100
            - Completed Tasks: ${tasks.length}
            - Recent Task Feedback: ${tasks.map(t => `${t.title} (Score: ${t.score}): ${t.feedback || 'No result'}`).join('; ')}

            Structure:
            1. **Executive Summary**: Brief overview of performance.
            2. **Key Strengths**: Highlight high-scoring areas.
            3. **Areas for Improvement**: Mention tasks with lower scores or critical feedback.
            4. **Final Recommendation**: Hire / Extend Internship / No Hire.

            Format the output in clean Markdown. Keep it professional but encouraging.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Report Error:", error);
    throw new Error("Failed to generate report");
  }
};