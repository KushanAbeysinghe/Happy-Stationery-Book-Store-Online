const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  const { userId, total, name, address, email, phone, city, postalCode, items } = req.body;

  try {
    if (!userId || !total || !name || !address || !email || !phone || !city || !postalCode || !items) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const orderId = await Order.create(userId, total, name, address, email, phone, city, postalCode);

    for (const item of items) {
      await Order.addOrderItem(orderId, item.id, item.quantity);
      const book = await Book.findById(item.id);
      const newStock = book.stock - item.quantity;
      await Book.updateStock(item.id, newStock);
    }

    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAllWithDetails();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const updatedRows = await Order.updateStatus(id, status);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
