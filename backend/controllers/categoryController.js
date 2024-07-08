const Category = require('../models/categoryModel');

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const categoryId = await Category.create(name);
    res.status(201).json({ categoryId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

module.exports = { createCategory, getCategories };
