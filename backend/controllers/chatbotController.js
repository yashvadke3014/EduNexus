const { classifyIntent } = require('../utils/nlpClassifier');
const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Course = require('../models/Course');
const Event = require('../models/Event');

/**
 * Content-Based Recommendation System — Research Component 2
 * Ranks items by relevance to the user's branch and skills
 */
const rankByRelevance = (items, userBranch, userSkills = []) => {
  return items
    .map(item => {
      let score = 0;
      if (item.branches && item.branches.includes('All')) score += 1;
      if (item.branches && item.branches.includes(userBranch)) score += 5;
      const itemSkills = item.skills || item.tags || [];
      const matching = userSkills.filter(s =>
        itemSkills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
      );
      score += matching.length * 2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);
};

const formatList = (items, fields) =>
  items.slice(0, 3).map((item, i) => {
    const line = fields.map(f => item[f]).filter(Boolean).join(' | ');
    return `${i + 1}. ${line}`;
  }).join('\n');

// POST /api/chatbot
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;
    const branch = user?.branch || 'CSE';
    const skills = user?.skills || [];

    const intent = classifyIntent(message);
    let responseText = '';
    let suggestions = [];

    switch (intent) {
      case 'greeting':
        responseText = `Hello${user ? ' ' + user.name.split(' ')[0] : ''}! 👋 I'm NexBot, your EduNexus mentor.\nI can help you find hackathons, internships, courses, events, and more.\nWhat are you looking for today?`;
        suggestions = ['Show hackathons', 'Find internships', 'Suggest courses', 'Upcoming events'];
        break;

      case 'hackathon': {
        const hacks = await Hackathon.find({ status: { $in: ['Upcoming', 'Ongoing'] } });
        const ranked = rankByRelevance(hacks, branch, skills);
        responseText = `Here are the top hackathons for you 🏆\n\n${formatList(ranked, ['title', 'mode', 'prizePool'])}`;
        suggestions = ['Show all hackathons', 'Find internships', 'Hackathon winners'];
        break;
      }

      case 'internship': {
        const interns = await Internship.find({ status: 'Open' });
        const ranked = rankByRelevance(interns, branch, skills);
        responseText = `Top internships for your profile 💼\n\n${formatList(ranked, ['title', 'company', 'stipend'])}`;
        suggestions = ['Show all internships', 'Find hackathons', 'Suggest courses'];
        break;
      }

      case 'course': {
        const courses = await Course.find({});
        const ranked = rankByRelevance(courses, branch, skills);
        responseText = `Recommended courses for you 📚\n\n${formatList(ranked, ['title', 'level', 'instructor'])}`;
        suggestions = ['Show all courses', 'Find internships'];
        break;
      }

      case 'event': {
        const events = await Event.find({ status: 'Upcoming' }).sort({ date: 1 });
        const ranked = rankByRelevance(events, branch, skills);
        responseText = `Upcoming events near you 🎯\n\n${formatList(ranked, ['title', 'category', 'mode'])}`;
        suggestions = ['Show all events', 'Find hackathons'];
        break;
      }

      case 'recommendation': {
        const [hacks, interns, courses] = await Promise.all([
          Hackathon.find({ status: 'Upcoming' }),
          Internship.find({ status: 'Open' }),
          Course.find({}),
        ]);
        const topHack = rankByRelevance(hacks, branch, skills)[0];
        const topIntern = rankByRelevance(interns, branch, skills)[0];
        const topCourse = rankByRelevance(courses, branch, skills)[0];
        responseText = `Here are my top picks for you 💡\n\n🏆 Hackathon: ${topHack?.title || 'None found'}\n💼 Internship: ${topIntern?.title || 'None found'} @ ${topIntern?.company || ''}\n📚 Course: ${topCourse?.title || 'None found'}`;
        suggestions = ['Show all hackathons', 'Show all internships', 'Show all courses'];
        break;
      }

      case 'winner': {
        const winners = await Hackathon.find({ status: 'Completed', 'winners.0': { $exists: true } });
        if (winners.length === 0) {
          responseText = 'No hackathon results yet. Check back soon! 🏅';
        } else {
          responseText = `Recent Hackathon Winners 🏅\n\n${winners.slice(0, 3).map(h =>
            `🏆 ${h.title}\n  🥇 ${h.winners[0]?.teamName} — ${h.winners[0]?.prize}`
          ).join('\n\n')}`;
        }
        suggestions = ['Show all hackathons', 'Find internships'];
        break;
      }

      case 'deadline': {
        const upcoming = await Hackathon.find({
          status: 'Upcoming',
          registrationDeadline: { $gte: new Date() }
        }).sort({ registrationDeadline: 1 }).limit(3);
        responseText = `⏰ Upcoming Deadlines\n\n${upcoming.map(h =>
          `• ${h.title} — ${h.registrationDeadline?.toDateString() || 'Check website'}`
        ).join('\n')}`;
        suggestions = ['Show all hackathons', 'Find internships'];
        break;
      }

      case 'help':
        responseText = `I'm NexBot 🤖 — Here's what I can do:\n\n• 🏆 Find hackathons for your branch\n• 💼 Suggest internships by skills\n• 📚 Recommend courses\n• 🎯 Show campus events\n• 🏅 Show hackathon winners\n• ⏰ Alert about deadlines\n• 💡 Give personalized recommendations\n\nJust ask me anything!`;
        suggestions = ['Show hackathons', 'Find internships', 'Recommend for me', 'Upcoming events'];
        break;

      default:
        responseText = `I'm not sure I understood that 🤔\n\nTry:\n• "show hackathons"\n• "find internships"\n• "suggest courses"\n• "upcoming events"\n• "recommend for me"`;
        suggestions = ['Show hackathons', 'Find internships', 'Help'];
    }

    res.json({ text: responseText, suggestions, intent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleChat };
