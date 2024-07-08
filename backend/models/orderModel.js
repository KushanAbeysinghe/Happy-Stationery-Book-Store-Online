const db = require('../config/db');

const Order = {
  create: async (userId, total, name, address, email, phone, city, postalCode) => {
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, total, name, address, email, phone, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, total, name, address, email, phone, city, postalCode]
    );
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM orders');
    return rows;
  },
  findAllWithDetails: async () => {
    const [orders] = await db.execute('SELECT * FROM orders');
    for (const order of orders) {
      const [orderItems] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = orderItems;
    }
    return orders;
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },
  updateStatus: async (id, status) => {
    const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  },
  addOrderItem: async (orderId, bookId, quantity) => {
    const [result] = await db.execute(
      'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)',
      [orderId, bookId, quantity]
    );
    return result.insertId;
  },
  findOrderItems: async (orderId) => {
    const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  }
};

module.exports = Order;
