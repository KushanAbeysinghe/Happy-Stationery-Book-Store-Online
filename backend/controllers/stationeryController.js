const Stationery = require('../models/stationeryModel');
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

const createStationery = async (req, res) => {
  const { title, price, stock, weight, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;
  const stationeryId = await Stationery.create(title, price, stock, weight, categoryId, image);
  res.status(201).json({ stationeryId });
};

const getStationery = async (req, res) => {
  const stationeryItems = await Stationery.findAll();
  res.json(stationeryItems);
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const categoryId = await Stationery.createCategory(name);
  res.status(201).json({ categoryId });
};

const getCategories = async (req, res) => {
  const categories = await Stationery.findCategories();
  res.json(categories);
};

const updateStationery = async (req, res) => {
  const { stock, price } = req.body;
  try {
    await Stationery.updateStockAndPrice(req.params.id, stock, price);
    res.status(200).json({ message: 'Stationery item updated successfully' });
  } catch (error) {
    console.error('Error updating stationery item:', error);
    res.status(500).json({ message: 'Error updating stationery item', error });
  }
};

const updateStationeryPrice = async (req, res) => {
  const { price } = req.body;
  try {
    const updatedRows = await Stationery.updatePrice(req.params.id, price);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Stationery item not found' });
    }
    res.json({ message: 'Stationery item price updated successfully' });
  } catch (error) {
    console.error('Error updating stationery item price:', error);
    res.status(500).json({ message: 'Error updating stationery item price', error });
  }
};

const deleteStationery = async (req, res) => {
  try {
    const stationery = await Stationery.findById(req.params.id);
    if (!stationery) {
      return res.status(404).json({ message: 'Stationery item not found' });
    }

    const imageFile = stationery.image;

    await Stationery.deleteById(req.params.id);

    if (imageFile) {
      const imagePath = path.join(__dirname, '../uploads', imageFile);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Stationery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting stationery item:', error);
    res.status(500).json({ message: 'Error deleting stationery item', error });
  }
};

module.exports = { createStationery, getStationery, createCategory, getCategories, updateStationery, updateStationeryPrice, deleteStationery };
