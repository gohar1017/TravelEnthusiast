const express = require('express');
const router = express.Router();
const TravelLog = require('../models/TravelLog');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create travel log
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location, tags, imageUrl } = req.body;
    
    if (!req.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const travelLog = new TravelLog({
      title,
      description,
      location,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      image: imageUrl,
      author: req.userId
    });

    await travelLog.save();
    
    // Populate author information before sending response
    await travelLog.populate('author', 'username profilePicture');
    
    res.status(201).json(travelLog);
  } catch (error) {
    console.error('Error creating travel log:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all travel logs
router.get('/', async (req, res) => {
  try {
    const logs = await TravelLog.find()
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's travel logs - MUST be before /:id route
router.get('/user/logs', auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const logs = await TravelLog.find({ author: req.userId })
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ 
      message: 'Server error while fetching user logs',
      error: error.message 
    });
  }
});

// Get travel log by ID
router.get('/:id', async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');
    
    if (!log) {
      return res.status(404).json({ message: 'Travel log not found' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike travel log
router.post('/:id/like', auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Travel log not found' });
    }

    const likeIndex = log.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      log.likes.push(req.user._id);
    } else {
      log.likes.splice(likeIndex, 1);
    }

    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a travel log
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (!req.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const log = await TravelLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Travel log not found' });
    }

    // Add the new comment with the user ID from auth middleware
    const newComment = {
      content,
      author: req.userId
    };

    log.comments.push(newComment);
    await log.save();
    
    // Fetch the updated log with populated fields
    const updatedLog = await TravelLog.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');
    
    res.status(201).json(updatedLog);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete a comment from a travel log
router.delete('/:logId/comments/:commentId', auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.logId);
    
    if (!log) {
      return res.status(404).json({ message: 'Travel log not found' });
    }

    const comment = log.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await log.save();
    
    const updatedLog = await TravelLog.findById(req.params.logId)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');
    
    res.json(updatedLog);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit a comment in a travel log
router.put('/:logId/comments/:commentId', auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.logId);
    
    if (!log) {
      return res.status(404).json({ message: 'Travel log not found' });
    }

    const comment = log.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Update the comment content
    comment.content = req.body.content;
    await log.save();
    
    // Fetch the updated log with populated fields
    const updatedLog = await TravelLog.findById(req.params.logId)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');
    
    res.json(updatedLog);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 