const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get website content by section
// @route   GET /api/content/:section
// @access  Public
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (content) {
      res.json(content.data);
    } else {
      res.status(404).json({ message: 'Content section not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update website content
// @route   PUT /api/content/:section
// @access  Private/Admin
router.put('/:section', protect, adminOnly, async (req, res) => {
  try {
    let content = await Content.findOne({ section: req.params.section });

    if (content) {
      content.data = req.body.data;
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      // If it doesn't exist, create it
      content = new Content({
        section: req.params.section,
        data: req.body.data
      });
      const createdContent = await content.save();
      res.status(201).json(createdContent);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
