const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controllers/studentController');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload-resumes', upload.array('resumes', 20), studentController.uploadResumes);
router.post('/bulk-save', studentController.saveStudents);
router.get('/', studentController.getAllStudents);

module.exports = router;
