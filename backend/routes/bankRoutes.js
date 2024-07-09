const express = require('express');
const { getBankDetails } = require('../controllers/bankController');

const router = express.Router();

router.get('/bank-details', getBankDetails);

module.exports = router;
