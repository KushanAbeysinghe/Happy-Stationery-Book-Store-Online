const db = require('../config/db');

const Book = {
  create: async (title, author, price, stock, categoryId, image, preorder = false) => {
    const [result] = await db.execute(
      'INSERT INTO books (title, author, price, stock, category_id, image, preorder) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, price, stock, categoryId, image, preorder]
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
  updateStockAndPrice: async (id, stock, price) => {
    const [result] = await db.execute('UPDATE books SET stock = ?, price = ? WHERE id = ?', [stock, price, id]);
    return result.affectedRows;
  }
};

module.exports = Book;
