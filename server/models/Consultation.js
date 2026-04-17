const mongoose = require('mongoose');

const consultationSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  concern: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: { type: String, required: true, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
