/**
 * NLP Intent Classifier — Rule-based weighted keyword matching
 * Research Component 1: NLP-based Event Classification
 *
 * Algorithm:
 * 1. Lowercase the message
 * 2. For each intent, scan for keyword patterns
 * 3. Accumulate weighted scores per intent
 * 4. Return the intent with highest score
 */

const INTENTS = {
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'howdy', 'sup', 'hola'],
    weight: 1
  },
  hackathon: {
    patterns: ['hackathon', 'hack', 'coding competition', 'compete', 'prize', 'team event', 'build sprint', 'devhack', 'sih'],
    weight: 2
  },
  internship: {
    patterns: ['internship', 'intern', 'job', 'company', 'stipend', 'work', 'placement', 'apply', 'career', 'job opening'],
    weight: 2
  },
  course: {
    patterns: ['course', 'learn', 'certificate', 'enroll', 'skill', 'tutorial', 'training', 'bootcamp', 'class', 'study'],
    weight: 2
  },
  event: {
    patterns: ['event', 'seminar', 'workshop', 'webinar', 'fest', 'conference', 'talk', 'session'],
    weight: 2
  },
  recommendation: {
    patterns: ['suggest', 'recommend', 'best for me', 'what should i', 'guide me', 'advise', 'what to do', 'personalize', 'suitable'],
    weight: 3
  },
  winner: {
    patterns: ['winner', 'result', 'who won', 'leaderboard', 'champion', 'hall of fame', 'podium', 'prize winner'],
    weight: 2
  },
  deadline: {
    patterns: ['deadline', 'last date', 'registration close', 'expiry', 'closing date', 'apply before', 'hurry'],
    weight: 2
  },
  branch: {
    patterns: ['cse', 'ece', 'mechanical', 'civil', 'electrical', 'it students', 'aids', 'aiml', 'branch'],
    weight: 2
  },
  help: {
    patterns: ['help', 'what can you do', 'features', 'how to use', 'guide', 'commands', 'options'],
    weight: 1
  }
};

/**
 * Classify intent from message using weighted keyword matching
 * @param {string} message - Raw user message
 * @returns {string} - Detected intent name
 */
const classifyIntent = (message) => {
  const msg = message.toLowerCase().trim();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENTS)) {
    scores[intent] = 0;
    for (const pattern of config.patterns) {
      if (msg.includes(pattern)) {
        scores[intent] += config.weight;
      }
    }
  }

  const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return topIntent[1] > 0 ? topIntent[0] : 'unknown';
};

module.exports = { classifyIntent, INTENTS };
