const express = require('express');
const { createBook, getBooks, upload } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload.single('image'), createBook);
router.get('/', getBooks);

module.exports = router;
