const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  branches: [{ type: String }],
  skills: [{ type: String }],
  duration: { type: String },
  stipend: { type: String },
  mode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Hybrid' },
  location: { type: String, default: 'India' },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  applyLink: { type: String, default: '' },
  tags: [{ type: String }],
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
