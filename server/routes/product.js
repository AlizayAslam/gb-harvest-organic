const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.role !== 'admin' && req.user.role !== 'headAdmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, price, category, description, stock, image } = req.body;
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: 'Name, price, category, and stock are required' });
    }
    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock cannot be negative' });
    }
    const product = new Product({ name, price, category, description, stock, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, price, category, description, stock, image } = req.body;
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: 'Name, price, category, and stock are required' });
    }
    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock cannot be negative' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, stock, image },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;