const db = require('../config/db');

const Book = {
  create: async (title, author, price, stock, categoryId, image, preorder = false, preorderDate = null) => {
    const [result] = await db.execute(
      'INSERT INTO books (title, author, price, stock, category_id, image, preorder, preorder_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, price, stock, categoryId, image, preorder, preorderDate]
    );
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM books');
    return rows.map(book => ({
      ...book,
      image: book.image ? `http://localhost:5000/uploads/${book.image}` : null
    }));
  },
  findPreorderBooks: async () => {
    const [rows] = await db.execute('SELECT * FROM books WHERE preorder = TRUE');
    return rows.map(book => ({
      ...book,
      image: book.image ? `http://localhost:5000/uploads/${book.image}` : null
    }));
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  },
  updateStockAndPrice: async (id, stock, price, preorder = false, preorderDate = null) => {
    const [result] = await db.execute(
      'UPDATE books SET stock = ?, price = ?, preorder = ?, preorder_date = ? WHERE id = ?',
      [stock !== undefined ? stock : null, price !== undefined ? price : null, preorder, preorderDate, id]
    );
    return result.affectedRows;
  },
  updateStock: async (id, stock) => {
    const [result] = await db.execute('UPDATE books SET stock = ? WHERE id = ?', [stock, id]);
    return result.affectedRows;
  },
  updatePreorder: async (id, preorder, preorderDate) => {
    const [result] = await db.execute(
      'UPDATE books SET preorder = ?, preorder_date = ? WHERE id = ?',
      [preorder, preorderDate, id]
    );
    return result.affectedRows;
  }
};

module.exports = Book;
