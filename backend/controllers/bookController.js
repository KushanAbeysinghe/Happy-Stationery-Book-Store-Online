// const Book = require('../models/bookModel');
// const multer = require('multer');
// const path = require('path');

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// const createBook = async (req, res) => {
//   const { title, author, price, stock, categoryId, preorder } = req.body;
//   const image = req.file ? req.file.filename : null;
//   const bookId = await Book.create(title, author, price, stock, categoryId, image, preorder === 'true');
//   res.status(201).json({ bookId });
// };

// const getBooks = async (req, res) => {
//   const books = await Book.findAll();
//   res.json(books);
// };

// const getPreorderBooks = async (req, res) => {
//   const books = await Book.findPreorderBooks();
//   res.json(books);
// };

// const updateBook = async (req, res) => {
//   const { id } = req.params;
//   const { stock, price } = req.body;

//   try {
//     const updatedRows = await Book.updateStockAndPrice(id, stock, price);
//     if (updatedRows === 0) {
//       return res.status(404).json({ message: 'Book not found' });
//     }
//     res.json({ message: 'Book updated successfully' });
//   } catch (error) {
//     console.error('Error updating book:', error);
//     res.status(500).json({ message: 'Failed to update book', error });
//   }
// };

// module.exports = { createBook, getBooks, getPreorderBooks, upload, updateBook };

const Book = require('../models/bookModel');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const createBook = async (req, res) => {
  const { title, author, price, stock, categoryId, preorder, preorderDate } = req.body;
  const image = req.file ? req.file.filename : null;
  const bookId = await Book.create(title, author, price, stock, categoryId, image, preorder, preorderDate);
  res.status(201).json({ bookId });
};

const getBooks = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

const getPreorderBooks = async (req, res) => {
  const books = await Book.findPreorderBooks();
  res.json(books);
};

const updateBook = async (req, res) => {
  const { stock, price, preorder, preorderDate } = req.body;
  try {
    await Book.updateStockAndPrice(req.params.id, stock, price, preorder, preorderDate);
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error });
  }
};

module.exports = { createBook, getBooks, updateBook, getPreorderBooks, upload };
