const db = require('../config/db');

const Book = {
  create: async (title, author, price, stock, categoryId, image) => {
    const [result] = await db.execute(
      'INSERT INTO books (title, author, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, price, stock, categoryId, image]
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
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  },
  updateStock: async (id, stock) => {
    const [result] = await db.execute('UPDATE books SET stock = ? WHERE id = ?', [stock, id]);
    return result.affectedRows;
  }
};

module.exports = Book;
