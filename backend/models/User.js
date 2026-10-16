const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  branch: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AIDS', 'AIML', 'DS', 'Other'],
    default: 'CSE'
  },
  year: { type: Number, min: 1, max: 4, default: 1 },
  skills: [{ type: String }],
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  savedHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
  savedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  registeredHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
