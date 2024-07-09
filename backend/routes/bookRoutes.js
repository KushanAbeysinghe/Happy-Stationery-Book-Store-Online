const express = require('express');
const { createBook, getBooks, updateBook, getPreorderBooks, upload } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload.single('image'), createBook);
router.get('/', getBooks);
router.get('/preorder', getPreorderBooks);  // Ensure this route has the correct callback
router.put('/:id', updateBook);  // Route to update book details

module.exports = router;
