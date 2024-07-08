const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/status', updateOrderStatus);  // Ensure this route is properly defined

module.exports = router;
