import React from 'react';

/**
 * RecommendationEngine Component
 * Visual display of the personalized ranking scores for internships/hackathons
 * Research Component 2 & 3 visualization
 */
const RecommendationEngine = ({ score = 0, maxScore = 10, label = 'Match Score' }) => {
  const filled = Math.round((score / maxScore) * 10);
  return (
    <div className="rank-bar">
      <span className="rank-score">{label}: {score}/{maxScore}</span>
      <div className="rank-dots">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`rank-dot${i < filled ? ' filled' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationEngine;
