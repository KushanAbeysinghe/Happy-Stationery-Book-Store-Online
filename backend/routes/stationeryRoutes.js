const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const StationeryController = require('../controllers/stationeryController');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes for stationery items
router.post('/stationery', upload.single('image'), StationeryController.createStationery);
router.get('/stationery', StationeryController.getStationery);
router.put('/stationery/:id', StationeryController.updateStationery); // Route to update stationery
router.put('/stationery/price/:id', StationeryController.updateStationeryPrice);
router.delete('/stationery/:id', StationeryController.deleteStationery);

// Routes for stationery categories
router.post('/stationery-categories', StationeryController.createCategory);
router.get('/stationery-categories', StationeryController.getCategories);

module.exports = router;
