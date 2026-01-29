const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/create', offerController.createOffer);
router.get('/:studentId', offerController.getOffers);

module.exports = router;
