const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TravelLog = require('../models/TravelLog');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's travel logs
router.get('/travel-logs', auth, async (req, res) => {
  try {
    const travelLogs = await TravelLog.find({ author: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(travelLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 