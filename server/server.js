const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err.message, err.stack));

// Mount routes
app.use('/api/products', upload.single('image'), productRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));