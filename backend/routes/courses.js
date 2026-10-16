const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse } = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);

module.exports = router;
