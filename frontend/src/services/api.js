const API_BASE_URL = 'http://localhost:5000/api/students';

export const uploadResumes = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/upload-resumes`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload resumes');
    }

    return response.json();
};

export const bulkSaveStudents = async (students) => {
    const response = await fetch(`${API_BASE_URL}/bulk-save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save students');
    }

    return response.json();
};
