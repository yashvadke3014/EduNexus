const Internship = require('../models/Internship');

/**
 * Personalized Ranking Algorithm — Research Component 3
 * Scores each internship based on user's branch and skills
 * Branch match: +5 pts, Generic (All): +1 pt, Each skill match: +2 pts
 */
const rankInternships = (internships, user) => {
  if (!user) return internships;

  return internships
    .map(intern => {
      let score = 0;
      if (intern.branches.includes('All')) score += 1;
      if (intern.branches.includes(user.branch)) score += 5;
      if (user.skills && intern.skills) {
        const matchingSkills = user.skills.filter(s =>
          intern.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
        );
        score += matchingSkills.length * 2;
      }
      return { intern, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(r => r.intern);
};

// GET /api/internships
const getInternships = async (req, res) => {
  try {
    const { branch, mode, status } = req.query;
    const filter = {};
    if (mode) filter.mode = mode;
    if (status) filter.status = status;
    if (branch && branch !== 'All') {
      filter.branches = { $in: [branch, 'All'] };
    }
    let internships = await Internship.find(filter).sort({ createdAt: -1 });

    // Apply personalized ranking if user is logged in
    if (req.user) {
      internships = rankInternships(internships, req.user);
    }

    res.json({ internships, personalized: !!req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/internships/:id
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/internships (admin)
const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInternships, getInternshipById, createInternship };
