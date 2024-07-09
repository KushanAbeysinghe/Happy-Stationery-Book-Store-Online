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
  const { title, author, price, stock, categoryId, preorder, preorderDate, preorderedStock } = req.body;
  const image = req.file ? req.file.filename : null;
  const bookId = await Book.create(title, author, price, stock, categoryId, image, preorder, preorderDate, preorderedStock);
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
  const { stock, price, preorder, preorderDate, preorderedStock } = req.body;
  try {
    const updatedRows = await Book.updateStockAndPrice(req.params.id, stock, price, preorder, preorderDate, preorderedStock);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error });
  }
};

// New function to transfer preordered stock to available stock
const transferPreorderStock = async (req, res) => {
  try {
    await Book.transferPreorderStock();
    res.status(200).json({ message: 'Preordered stock transferred to available stock' });
  } catch (error) {
    console.error('Error transferring preorder stock:', error);
    res.status(500).json({ message: 'Error transferring preorder stock', error });
  }
};

module.exports = { createBook, getBooks, updateBook, getPreorderBooks, upload, transferPreorderStock };
