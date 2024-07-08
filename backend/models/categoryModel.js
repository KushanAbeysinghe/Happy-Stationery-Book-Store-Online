const db = require('../config/db');

const Category = {
  create: async (name) => {
    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM categories');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Category;
