const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    console.log('Fetching preferences for user:', req.user._id);
    const user = await User.findById(req.user._id).select('preferences');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.preferences || { genres: [], favoriteArtists: [] });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    console.log('Updating preferences for user:', req.user._id);
    console.log('New preferences:', req.body);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true }
    ).select('preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.preferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

module.exports = router;