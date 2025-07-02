const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
});

// Add a new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category, stock, image } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and stock are required',
      });
    }

    const product = new Product({ name, price, description, category, stock, image });
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message,
    });
  }
});

// Edit an existing product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, stock, image } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and stock are required',
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, stock, image, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit product',
      error: error.message,
    });
  }
});

module.exports = router;