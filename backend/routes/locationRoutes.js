const express = require('express');
const { getProvinces, getDistricts, getAreas } = require('../controllers/locationController');

const router = express.Router();

router.get('/provinces', getProvinces);
router.get('/districts', getDistricts);
router.get('/areas', getAreas);

module.exports = router;
