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
  const { title, author, price, stock, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;
  const bookId = await Book.create(title, author, price, stock, categoryId, image);
  res.status(201).json({ bookId });
};

const getBooks = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

module.exports = { createBook, getBooks, upload };
