const Stationery = require('../models/stationeryModel');

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

module.exports = { createStationery, getStationery, createCategory, getCategories, updateStationery };
