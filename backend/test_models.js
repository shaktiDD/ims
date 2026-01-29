require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // For GoogleGenerativeAI SDK, we might need to access the model list differently
        // or just try a standard generation with a known model to verify.
        // But the error message suggested "Call ListModels".
        // The Node SDK usually doesn't expose listModels directly on the main class in older versions,
        // but let's try the model manager if available, or just check documentation behavior via trial.

        // Actually, let's try to get a model and print it.
        // There is no direct listModels() in the high-level SDK usually.
        // We will try to fetch with 'gemini-pro' as a fallback to see if that works.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("gemini-pro is WORKING");

    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        await model.generateContent("Test");
        console.log("gemini-1.0-pro is WORKING");
    } catch (error) {
        console.error("gemini-1.0-pro failed:", error.message);
    }

    try {
        // Trying the exact string often used in tutorials
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        // Note: vision model might not support text-only? 
        // Let's try standard pro
    } catch (e) { }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        await model.generateContent("Test");
        console.log("gemini-1.5-pro-latest is WORKING");
    } catch (error) {
        console.error("gemini-1.5-pro-latest failed:", error.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log("gemini-1.5-flash is WORKING");
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }
}

listModels();
