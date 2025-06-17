const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log('Login attempt:', { usernameOrEmail });

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Please provide both username/email and password' });
    }

    // Check if user exists
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });

    if (!user) {
      console.log('User not found:', usernameOrEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password verification failed for:', user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Token creation error:', err);
          return res.status(500).json({ message: 'Error creating authentication token' });
        }
        console.log('Login successful for:', user.email);
        res.json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Profile request received. User ID:', req.user.id);
    
    if (!req.user.id) {
      console.log('No user ID in request');
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(req.user.id).select('-password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Sending user profile data');
    res.json(user);
  } catch (err) {
    console.error('Error in profile route:', err);
    res.status(500).json({ 
      message: 'Server error while fetching profile',
      error: err.message 
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { profilePicture, username, email, bio } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (profilePicture) user.profilePicture = profilePicture;
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    // Save updated user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router; 