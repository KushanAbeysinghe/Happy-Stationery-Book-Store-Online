
const Order = require('../models/orderModel');
const Book = require('../models/bookModel');
const Stationery = require('../models/stationeryModel');
const User = require('../models/userModel');
const db = require('../config/db');

const createOrder = async (req, res) => {
  const { total, name, address, email, phone, postalCode, province, district, area, items, paymentMethod } = req.body;

  try {
    if (!total || !name || !address || !email || !phone || !postalCode || !province || !district || !area || !items || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let user = await User.findByEmail(email);
    if (!user) {
      user = await User.create(name, email, phone, address, postalCode, province, district, area);
    }

    const orderId = await Order.create(user.id, total, user.username, address, email, phone, postalCode, province, district, area, paymentMethod);

    for (const item of items) {
      let itemExists;
      if (item.type === 'book') {
        itemExists = await Book.findById(item.id);
      } else if (item.type === 'stationery') {
        itemExists = await Stationery.findById(item.id);
      }

      if (!itemExists) {
        throw new Error(`Item with ID ${item.id} of type ${item.type} does not exist`);
      }

      await Order.addOrderItem(orderId, item.id, item.quantity, item.type);

      if (item.type === 'book') {
        const book = await Book.findById(item.id);
        const newStock = book.stock - item.quantity;
        await Book.updateStock(item.id, newStock);

        if (newStock <= 0) {
          await Book.updatePreorder(item.id, 1, new Date().toISOString().split('T')[0]);
        }
      } else if (item.type === 'stationery') {
        const stationery = await Stationery.findById(item.id);
        const newStock = stationery.stock - item.quantity;
        await Stationery.updateStock(item.id, newStock);
      }
    }

    res.status(201).json({ orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAllWithDetails();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

const getBankDetails = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bank_details LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Bank details not found' });
    }
  } catch (error) {
    console.error('Error fetching bank details:', error);
    res.status(500).json({ message: 'Error fetching bank details' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getBankDetails };
