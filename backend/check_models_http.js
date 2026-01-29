const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Available Models:");
            if (json.models) {
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("No models field in response:", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => {
    console.error("HTTP Error:", e.message);
});
