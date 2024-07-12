const express = require('express');
const { createBook, getBooks, updateBook, updateBookPrice, deleteBook, getPreorderBooks, upload, transferPreorderStock, transferPreorderStockManually } = require('../controllers/bookController');

const router = express.Router();

router.post('/', upload, createBook);
router.get('/', getBooks);
router.get('/preorder', getPreorderBooks);
router.put('/:id', updateBook);
router.put('/price/:id', updateBookPrice);
router.delete('/:id', deleteBook);
router.put('/transfer-preorder-stock', transferPreorderStock);
router.post('/transfer-preorder-stock', transferPreorderStockManually);

module.exports = router;
