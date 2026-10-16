const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);

module.exports = router;
