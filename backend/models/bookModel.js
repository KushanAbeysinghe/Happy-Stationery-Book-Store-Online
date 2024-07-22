const db = require('../config/db');

const Book = {
  create: async (title, author, price, stock, categoryId, images, preorder = false, preorderDate = null, preorderedStock = 0, isbn13, language, binding, publisher, publishingDate, productEdition, weight, description) => {
    const [result] = await db.execute(
      'INSERT INTO books (title, author, price, stock, category_id, image1, image2, image3, preorder, preorder_date, preordered_stock, isbn13, language, binding, publisher, publishing_date, product_edition, weight, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, price, stock, categoryId, images[0] || null, images[1] || null, images[2] || null, preorder, preorderDate, preorderedStock, isbn13, language, binding, publisher, publishingDate, productEdition, weight, description || 'No Description Available for this product']
    );
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM books');
    return rows.map(book => ({
      ...book,
      images: [
        book.image1 ? `https://karateonline.lk/uploads/${book.image1}` : null,
        book.image2 ? `https://karateonline.lk/uploads/${book.image2}` : null,
        book.image3 ? `https://karateonline.lk/uploads/${book.image3}` : null
      ].filter(image => image !== null)
    }));
  },
  findPreorderBooks: async () => {
    const [rows] = await db.execute('SELECT * FROM books WHERE preorder = TRUE');
    return rows.map(book => ({
      ...book,
      images: [
        book.image1 ? `https://karateonline.lk/uploads/${book.image1}` : null,
        book.image2 ? `https://karateonline.lk/uploads/${book.image2}` : null,
        book.image3 ? `https://karateonline.lk/uploads/${book.image3}` : null
      ].filter(image => image !== null)
    }));
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id]);
    const book = rows[0];
    if (book) {
      book.images = [
        book.image1 ? `https://karateonline.lk/uploads/${book.image1}` : null,
        book.image2 ? `https://karateonline.lk/uploads/${book.image2}` : null,
        book.image3 ? `https://karateonline.lk/uploads/${book.image3}` : null
      ].filter(image => image !== null);
    }
    return book;
  },
  updateStockAndPrice: async (id, stock, price, preorder = false, preorderDate = null, preorderedStock = 0) => {
    const [result] = await db.execute(
      'UPDATE books SET stock = ?, price = ?, preorder = ?, preorder_date = ?, preordered_stock = ? WHERE id = ?',
      [stock !== undefined ? stock : null, price !== undefined ? price : null, preorder, preorderDate, preorderedStock, id]
    );
    return result.affectedRows;
  },
  updatePrice: async (id, price) => {
    const [result] = await db.execute('UPDATE books SET price = ? WHERE id = ?', [price, id]);
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
  },
  transferPreorderStock: async () => {
    const [result] = await db.execute(`
      UPDATE books 
      SET stock = stock + preordered_stock, preordered_stock = 0, preorder = 0, preorder_date = NULL
      WHERE preorder = 1 AND preorder_date = CURDATE()
    `);
    return result.affectedRows;
  },
  isReferenced: async (id) => {
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM order_items WHERE book_id = ?', [id]);
    return rows[0].count > 0;
  },
  deleteById: async (id) => {
    const [result] = await db.execute('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Book;
