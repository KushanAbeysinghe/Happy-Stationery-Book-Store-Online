const express = require('express');
const { createOrder, getOrders, updateOrderStatus, getBankDetails } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/status', updateOrderStatus);
router.get('/bank-details', getBankDetails); // Add this line to fetch bank details

module.exports = router;
