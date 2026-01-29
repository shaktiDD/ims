const axios = require('axios');

const test = async () => {
    try {
        console.log("Fetching students...");
        const resStats = await axios.get('http://localhost:5000/api/students?status=hired');
        const students = resStats.data;

        if (!students || students.length === 0) {
            console.log('No hired students found.');
            return;
        }

        const sId = students[0].id;
        console.log(`Assigning to Student ID: ${sId}`);

        const payload = {
            studentIds: [sId],
            title: "Debug Task 1",
            description: "Testing API",
            priority: "med",
            dueDate: new Date().toISOString()
        };

        const res = await axios.post('http://localhost:5000/api/tasks', payload);
        console.log("Task Created Successfully:", res.data);
    } catch (e) {
        if (e.response) {
            console.error("API Error:", e.response.status, e.response.data);
        } else {
            console.error("Network/Other Error:", e.message);
        }
    }
};

test();
