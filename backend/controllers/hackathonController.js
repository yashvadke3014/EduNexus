const Hackathon = require('../models/Hackathon');

// GET /api/hackathons
const getHackathons = async (req, res) => {
  try {
    const { branch, status, mode } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (mode) filter.mode = mode;
    if (branch && branch !== 'All') {
      filter.branches = { $in: [branch, 'All'] };
    }
    const hackathons = await Hackathon.find(filter).sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/hackathons/public/winners
const getWinners = async (req, res) => {
  try {
    const winners = await Hackathon.find({ status: 'Completed', 'winners.0': { $exists: true } });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/hackathons/:id
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/hackathons (admin)
const createHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/hackathons/:id (admin)
const updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHackathons, getWinners, getHackathonById, createHackathon, updateHackathon };
