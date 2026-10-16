const Course = require('../models/Course');

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { branch, level } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (branch && branch !== 'All') {
      filter.branches = { $in: [branch, 'All'] };
    }
    const courses = await Course.find(filter).sort({ totalEnrolled: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses (admin)
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/courses/:id (admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse };
