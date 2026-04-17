const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { protect, adminOnly } = require('../middleware/auth');

// @route POST /api/consultations
router.post('/', async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body);
    res.status(201).json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/consultations
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/consultations/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    
    consultation.status = req.body.status || consultation.status;
    const updated = await consultation.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
