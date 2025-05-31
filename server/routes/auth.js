const express = require('express');
     const router = express.Router();
     const User = require('../models/User');
     const bcrypt = require('bcryptjs');
     const jwt = require('jsonwebtoken');

     router.post('/login', async (req, res) => {
       const { email, password } = req.body;
       const user = await User.findOne({ email });
       if (!user || !(await bcrypt.compare(password, user.password))) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }
       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
       res.json({ token, role: user.role });
     });

     router.post('/signup', async (req, res) => {
       const { name, email, password } = req.body;
       const user = new User({
         name,
         email,
         password: await bcrypt.hash(password, 10),
         role: email === 'admin@example.com' ? 'admin' : 'user'
       });
       await user.save();
       res.status(201).json({ message: 'User created' });
     });

     module.exports = router;