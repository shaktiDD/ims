const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// We'll use fetch directly since we just want to list models and SDK method varies
async function listModels() {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("Error: GEMINI_API_KEY is not set in .env");
            return;
        }
        console.log("Fetching models with key ending in...", key.slice(-4));

        // v1beta is the version used in the error message
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            const text = await response.text();
            console.error("Response body:", text);
            return;
        }

        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                // Filter for models that likely support generateContent
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
