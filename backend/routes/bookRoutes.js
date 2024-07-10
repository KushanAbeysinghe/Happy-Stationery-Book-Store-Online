const express = require('express');
const { createBook, getBooks, updateBook, getPreorderBooks, upload, transferPreorderStock, transferPreorderStockManually } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload, createBook);
router.get('/', getBooks);
router.get('/preorder', getPreorderBooks);
router.put('/:id', updateBook);
router.put('/transfer-preorder-stock', transferPreorderStock);
router.post('/transfer-preorder-stock', transferPreorderStockManually);

module.exports = router;
