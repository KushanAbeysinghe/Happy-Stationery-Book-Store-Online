const express = require('express');
const { createBook, getBooks, getPreorderBooks, upload, updateBook } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload.single('image'), createBook);
router.get('/', getBooks);
router.get('/preorder', getPreorderBooks);  // Route to get preorder books
router.put('/:id', updateBook); // Route to update book

module.exports = router;
