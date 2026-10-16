const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, default: '' },
  source: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Tech', 'Dev', 'Engineering', 'Research', 'General'],
    default: 'Tech'
  },
  image: { type: String, default: '' },
  pubDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
