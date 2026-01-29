const axios = require('axios');

const testTask = async () => {
    try {
        // 1. Get a student
        const studentRes = await axios.get('http://localhost:5000/api/students');
        const student = studentRes.data[0];

        if (!student) {
            console.log("No students found to assign task to.");
            return;
        }

        console.log(`Assigning to: ${student.name} (ID: ${student.id})`);

        // 2. Create Task
        const taskPayload = {
            title: "Debug Task",
            description: "Testing API",
            assignedTo: [student.id], // Array based on previous logic
            priority: "high",
            dueDate: new Date().toISOString()
        };

        const res = await axios.post('http://localhost:5000/api/tasks', taskPayload);
        console.log("Task Created:", res.data);

    } catch (err) {
        console.error("Task Creation Failed:", err.response ? err.response.data : err.message);
    }
};

testTask();
