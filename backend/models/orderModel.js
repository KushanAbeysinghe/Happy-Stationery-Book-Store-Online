// const db = require('../config/db');

// const Order = {
//   create: async (userId, total, name, address, email, phone, postalCode, province, district, area, paymentMethod) => {
//     const [result] = await db.execute(
//       'INSERT INTO orders (user_id, total, name, address, email, phone, postal_code, province, district, area, payment_method, status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())',
//       [userId, total, name, address, email, phone, postalCode, province, district, area, paymentMethod]
//     );
//     return result.insertId;
//   },
//   findAllWithDetails: async () => {
//     const [orders] = await db.execute(`
//       SELECT o.*, p.name AS province_name, d.name AS district_name, a.name AS area_name, a.delivery_fee
//       FROM orders o
//       LEFT JOIN provinces p ON o.province = p.id
//       LEFT JOIN districts d ON o.district = d.id
//       LEFT JOIN areas a ON o.area = a.id
//     `);
//     for (const order of orders) {
//       const [orderItems] = await db.execute(`
//         SELECT order_items.*, 
//           CASE 
//             WHEN order_items.book_id IS NOT NULL THEN books.title 
//             WHEN order_items.stationery_id IS NOT NULL THEN stationery.title 
//           END AS title,
//           CASE 
//             WHEN order_items.book_id IS NOT NULL THEN books.price 
//             WHEN order_items.stationery_id IS NOT NULL THEN stationery.price 
//           END AS price
//         FROM order_items
//         LEFT JOIN books ON order_items.book_id = books.id
//         LEFT JOIN stationery ON order_items.stationery_id = stationery.id
//         WHERE order_items.order_id = ?
//       `, [order.id]);
//       order.items = orderItems;
//     }
//     return orders;
//   },
//   findById: async (id) => {
//     const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
//     return rows[0];
//   },
//   updateStatus: async (id, status) => {
//     const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
//     return result.affectedRows;
//   },
//   addOrderItem: async (orderId, itemId, quantity, type) => {
//     let query;
//     let params;

//     if (type === 'book') {
//       query = 'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)';
//       params = [orderId, itemId, quantity];
//     } else if (type === 'stationery') {
//       query = 'INSERT INTO order_items (order_id, stationery_id, quantity) VALUES (?, ?, ?)';
//       params = [orderId, itemId, quantity];
//     }

//     console.log("Adding order item with query:", query);
//     console.log("Parameters:", params);

//     if (params.includes(undefined)) {
//       throw new Error('Parameters must not contain undefined. Check the values being passed.');
//     }

//     const [result] = await db.execute(query, params);
//     return result.insertId;
//   },
//   findOrderItems: async (orderId) => {
//     const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
//     return rows;
//   }
// };

// module.exports = Order;

const db = require('../config/db');

const Order = {
  create: async (userId, total, name, address, email, phone, postalCode, province, district, area, paymentMethod) => {
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, total, name, address, email, phone, postal_code, province, district, area, payment_method, status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())',
      [userId, total, name, address, email, phone, postalCode, province, district, area, paymentMethod]
    );
    return result.insertId;
  },
  findAllWithDetails: async () => {
    const [orders] = await db.execute(`
      SELECT o.*, p.name AS province_name, d.name AS district_name, a.name AS area_name, a.delivery_fee
      FROM orders o
      LEFT JOIN provinces p ON o.province = p.id
      LEFT JOIN districts d ON o.district = d.id
      LEFT JOIN areas a ON o.area = a.id
    `);
    for (const order of orders) {
      const [orderItems] = await db.execute(`
        SELECT order_items.*, 
          CASE 
            WHEN order_items.book_id IS NOT NULL THEN books.title 
            WHEN order_items.stationery_id IS NOT NULL THEN stationery.title 
          END AS title,
          CASE 
            WHEN order_items.book_id IS NOT NULL THEN books.price 
            WHEN order_items.stationery_id IS NOT NULL THEN stationery.price 
          END AS price,
          books.isbn13
        FROM order_items
        LEFT JOIN books ON order_items.book_id = books.id
        LEFT JOIN stationery ON order_items.stationery_id = stationery.id
        WHERE order_items.order_id = ?
      `, [order.id]);
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
  addOrderItem: async (orderId, itemId, quantity, type) => {
    let query;
    let params;

    if (type === 'book') {
      query = 'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)';
      params = [orderId, itemId, quantity];
    } else if (type === 'stationery') {
      query = 'INSERT INTO order_items (order_id, stationery_id, quantity) VALUES (?, ?, ?)';
      params = [orderId, itemId, quantity];
    }

    console.log("Adding order item with query:", query);
    console.log("Parameters:", params);

    if (params.includes(undefined)) {
      throw new Error('Parameters must not contain undefined. Check the values being passed.');
    }

    const [result] = await db.execute(query, params);
    return result.insertId;
  },
  findOrderItems: async (orderId) => {
    const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  }
};

module.exports = Order;
