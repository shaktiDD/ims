const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/status', taskController.updateTaskStatus);
router.put('/grade', taskController.gradeTask); // [NEW]

module.exports = router;
