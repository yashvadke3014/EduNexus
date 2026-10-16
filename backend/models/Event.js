const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Webinar', 'Cultural', 'Sports', 'Technical'],
    default: 'Workshop'
  },
  organizer: { type: String, required: true },
  branches: [{ type: String }],
  date: { type: Date, required: true },
  time: { type: String, default: '10:00 AM' },
  venue: { type: String, default: 'TBD' },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
  registrationFee: { type: Number, default: 0 },
  tags: [{ type: String }],
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  applyLink: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
