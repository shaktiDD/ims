const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const testUpload = async () => {
    try {
        const form = new FormData();
        // Create a dummy PDF file if it doesn't exist
        const filePath = path.join(__dirname, 'dummy.pdf');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, 'This is not a real PDF content, just text.');
        }

        form.append('resumes', fs.createReadStream(filePath));

        console.log('Sending request to http://localhost:5000/api/students/upload-resumes...');

        const response = await axios.post('http://localhost:5000/api/students/upload-resumes', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testUpload();
