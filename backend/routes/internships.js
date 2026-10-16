const express = require('express');
const router = express.Router();
const { getInternships, getInternshipById, createInternship } = require('../controllers/internshipController');
const { optionalAuth, protect, adminOnly } = require('../middleware/auth');

router.get('/', optionalAuth, getInternships);
router.get('/:id', getInternshipById);
router.post('/', protect, adminOnly, createInternship);

module.exports = router;
