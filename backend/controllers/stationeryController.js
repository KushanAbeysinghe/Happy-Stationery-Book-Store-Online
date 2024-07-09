const Stationery = require('../models/stationeryModel');
const StationeryCategory = require('../models/stationeryCategoryModel');

const createStationery = async (req, res) => {
  const { title, price, stock, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;
  const stationeryId = await Stationery.create(title, price, stock, categoryId, image);
  res.status(201).json({ stationeryId });
};

const getStationery = async (req, res) => {
  const stationeryItems = await Stationery.findAll();
  res.json(stationeryItems);
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const categoryId = await StationeryCategory.create(name);
  res.status(201).json({ categoryId });
};

const getCategories = async (req, res) => {
  const categories = await StationeryCategory.findAll();
  res.json(categories);
};

const updateStationery = async (req, res) => {
  const { id } = req.params;
  const { stock, price } = req.body;

  try {
    const updatedRows = await Stationery.updateStockAndPrice(id, stock, price);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Stationery item not found' });
    }
    res.json({ message: 'Stationery item updated successfully' });
  } catch (error) {
    console.error('Error updating stationery item:', error);
    res.status(500).json({ message: 'Failed to update stationery item', error });
  }
};

module.exports = { createStationery, getStationery, createCategory, getCategories, updateStationery };
