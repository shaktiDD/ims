const express = require('express');
const router = express.Router();
const multer = require('multer');
const intakeController = require('../controllers/intakeController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('resumes', 50), intakeController.parseResume);
router.post('/confirm', intakeController.confirmCandidates);

module.exports = router;
