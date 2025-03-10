const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password, department } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        department,
        role: 'crew' // default role
      });

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Google sign-in/sign-up
  google: async (req, res) => {
    try {
      const { email, name, department } = req.body;

      if (!email || !name || !department) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find or create user
      let user = await User.findOne({ email });
      
      if (!user) {
        // Create new user with a random password (they'll use Google to sign in)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await User.create({
          name,
          email,
          password: hashedPassword,
          department,
          role: 'crew' // default role
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
        },
        token
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController; 