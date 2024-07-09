const express = require('express');
const { createBook, getBooks, updateBook, getPreorderBooks, transferPreorderStock, upload } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload.single('image'), createBook);
router.get('/', getBooks);
router.get('/preorder', getPreorderBooks);  // Ensure this route has the correct callback
router.put('/:id', updateBook);  // Route to update book details
router.post('/transfer-preorder-stock', transferPreorderStock);  // New route to transfer preordered stock

module.exports = router;
