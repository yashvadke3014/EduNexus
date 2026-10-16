const express = require('express');
const router = express.Router();
const { getHackathons, getWinners, getHackathonById, createHackathon, updateHackathon } = require('../controllers/hackathonController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getHackathons);
router.get('/public/winners', getWinners);
router.get('/:id', getHackathonById);
router.post('/', protect, adminOnly, createHackathon);
router.put('/:id', protect, adminOnly, updateHackathon);

module.exports = router;
