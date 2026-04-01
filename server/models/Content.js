const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true, // e.g., 'homepage', 'about', 'contact'
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Allows flexible key-value pairs
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
