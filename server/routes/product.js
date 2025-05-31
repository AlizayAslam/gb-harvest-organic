const express = require('express');
  const router = express.Router();
  const Product = require('../models/Product');
  const authMiddleware = require('../middleware/auth');

  // GET all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // POST a new product (admin only)
  router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: 'Failed to add product' });
    }
  });

  // PUT update a product (admin only)
  router.put('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update product' });
    }
  });

  // DELETE a product (admin only)
  router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  module.exports = router;