const Book = require('../models/bookModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  const {
    title,
    author,
    price,
    stock,
    categoryId,
    preorder,
    preorderDate,
    preorderedStock,
    isbn13,
    language,
    binding,
    publisher,
    publishingDate,
    productEdition,
    weight,
    description
  } = req.body;
  const images = req.files.map(file => file.filename);
  const bookId = await Book.create(title,
    author,
    price,
    stock,
    categoryId,
    images,
    preorder,
    preorderDate,
    preorderedStock,
    isbn13,
    language,
    binding,
    publisher,
    publishingDate,
    productEdition,
    weight,
    description || 'No Description Available for this product');
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

const updateBookPrice = async (req, res) => {
  const { price } = req.body;
  try {
    const updatedRows = await Book.updatePrice(req.params.id, price);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book price updated successfully' });
  } catch (error) {
    console.error('Error updating book price:', error);
    res.status(500).json({ message: 'Error updating book price', error });
  }
};

const deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    const isReferenced = await Book.isReferenced(id);
    if (isReferenced) {
      return res.status(400).json({ message: 'Cannot delete book because it is referenced in order items' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete book images from the file system
    if (book.images) {
      book.images.forEach(image => {
        fs.unlink(path.join(__dirname, '..', 'uploads', path.basename(image)), err => {
          if (err) {
            console.error(`Failed to delete image file: ${image}`, err);
          }
        });
      });
    }

    const deletedRows = await Book.deleteById(id);
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

const transferPreorderStock = async (req, res) => {
  try {
    await Book.transferPreorderStock();
    res.status(200).json({ message: 'Preordered stock transferred to available stock' });
  } catch (error) {
    console.error('Error transferring preorder stock:', error);
    res.status(500).json({ message: 'Error transferring preorder stock', error });
  }
};

const transferPreorderStockManually = async (req, res) => {
  try {
    const updatedRows = await Book.transferPreorderStock();
    res.status(200).json({ message: `Transferred preorder stock for ${updatedRows} books` });
  } catch (error) {
    console.error('Error transferring preorder stock:', error);
    res.status(500).json({ message: 'Error transferring preorder stock', error });
  }
};

module.exports = { createBook, getBooks, updateBook, updateBookPrice, deleteBook, getPreorderBooks, upload: upload.array('images', 3), transferPreorderStock, transferPreorderStockManually };
