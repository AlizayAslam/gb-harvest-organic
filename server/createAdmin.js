require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const email = 'admin@gbharvest.com';
    const password = 'Harvest123';
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin created successfully:', { email, password });
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();