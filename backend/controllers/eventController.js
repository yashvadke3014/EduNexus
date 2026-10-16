const Event = require('../models/Event');

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const { branch, category, mode, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (mode) filter.mode = mode;
    if (status) filter.status = status;
    if (branch && branch !== 'All') {
      filter.branches = { $in: [branch, 'All'] };
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events (admin)
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/:id (admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent };
