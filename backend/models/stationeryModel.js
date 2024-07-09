const db = require('../config/db');

const Stationery = {
  create: async (title, price, stock, categoryId, image) => {
    const [result] = await db.execute(
      'INSERT INTO stationery (title, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?)',
      [title, price, stock, categoryId, image]
    );
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute(`
      SELECT s.*, sc.name as category_name
      FROM stationery s
      LEFT JOIN stationery_categories sc ON s.category_id = sc.id
    `);
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      price: row.price,
      stock: row.stock,
      category_id: row.category_id,
      category_name: row.category_name,
      image: row.image ? `http://localhost:5000/uploads/${row.image}` : null
    }));
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM stationery WHERE id = ?', [id]);
    return rows[0];
  },
  updateStock: async (id, stock) => {
    const [result] = await db.execute('UPDATE stationery SET stock = ? WHERE id = ?', [stock, id]);
    return result.affectedRows;
  },
  updateStockAndPrice: async (id, stock, price) => {
    const query = `
      UPDATE stationery 
      SET 
        stock = ?, 
        price = ? 
      WHERE id = ?`;
    
    const params = [
      stock !== undefined ? stock : null,
      price !== undefined ? price : null,
      id
    ];

    const [result] = await db.execute(query, params);
    return result.affectedRows;
  },
  createCategory: async (name) => {
    const [result] = await db.execute(
      'INSERT INTO stationery_categories (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  },
  findCategories: async () => {
    const [rows] = await db.execute('SELECT * FROM stationery_categories');
    return rows;
  }
};

module.exports = Stationery;
