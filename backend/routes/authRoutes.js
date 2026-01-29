const express = require('express');
const router = express.Router();
const { internLogin, managerLogin } = require('../controllers/authController');

router.post('/intern/login', internLogin);
router.post('/manager/login', managerLogin);

module.exports = router;
