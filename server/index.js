const express = require('express');
     const mongoose = require('mongoose');
     const cors = require('cors');
     require('dotenv').config();
     const authRoutes = require('./routes/auth');
     const productRoutes = require('./routes/product');

     const app = express();

     // Middleware
     app.use(cors());
     app.use(express.json());

     // Routes
     app.use('/api/auth', authRoutes);
     app.use('/api/products', productRoutes);

     // MongoDB connection
     mongoose.connect(process.env.MONGODB_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
       .then(() => console.log('Connected to MongoDB'))
       .catch((err) => console.error('MongoDB connection error:', err));

     // Start server
     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));