const axios = require('axios');

async function checkEndpoints() {
    console.log("Checking Server Status...");

    // Check Board (should exist)
    try {
        await axios.get('http://localhost:5000/api/board');
        console.log("✅ /api/board is reachable");
    } catch (e) {
        console.log(`❌ /api/board failed: ${e.message} (Status: ${e.response?.status})`);
    }

    // Check Offers (the failed one)
    try {
        await axios.get('http://localhost:5000/api/offers/123'); // Should return 200 or 500, but not 404 if route exists
        console.log("✅ /api/offers/:id is reachable");
    } catch (e) {
        if (e.response?.status === 404) {
            console.log("❌ /api/offers returned 404 -> Route NOT registered!");
        } else {
            console.log(`✅ /api/offers is reachable (Status: ${e.response?.status}) -> Route IS registered`);
        }
    }
}

checkEndpoints();
