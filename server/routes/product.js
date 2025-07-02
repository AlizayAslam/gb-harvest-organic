
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error: Failed to fetch products' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error: Failed to fetch product' });
  }
});


router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'headAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('Received product data:', req.body, req.file);
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image: req.file ? req.file.path.replace(/\\/g, '/') : req.body.imageUrl || '',
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(400).json({ message: err.message });
  }
});


router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'headAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    if (req.file) {
      product.image = req.file.path.replace(/\\/g, '/');
    } else if (req.body.imageUrl) {
      product.image = req.body.imageUrl;
    }
    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'headAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('Deleting product with ID:', req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;