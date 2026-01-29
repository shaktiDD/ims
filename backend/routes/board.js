const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getBoard);
router.put('/move', boardController.moveCandidate);

module.exports = router;
