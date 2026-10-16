const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  duration: String,
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  branches: [{ type: String }],
  skills: [{ type: String }],
  price: { type: Number, default: 0 },
  duration: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  tags: [{ type: String }],
  totalEnrolled: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  modules: [moduleSchema],
  thumbnail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
