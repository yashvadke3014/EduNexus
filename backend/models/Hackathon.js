const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  position: Number,
  teamName: String,
  members: [String],
  prize: String,
});

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  branches: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  registrationDeadline: { type: Date },
  registrationFee: { type: Number, default: 0 },
  prizePool: { type: String },
  tags: [{ type: String }],
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Online' },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  winners: [winnerSchema],
  registeredCount: { type: Number, default: 0 },
  maxParticipants: { type: Number, default: 500 },
  applyLink: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
