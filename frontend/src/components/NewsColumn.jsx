import React from 'react';

const bgMap = { Tech: 'tech', Dev: 'dev', Engineering: 'eng', Research: 'res' };
const emojiMap = { Tech: '💻', Dev: '🧑‍💻', Engineering: '⚙️', Research: '🔬' };
const tagMap = { Tech: 'tag-purple', Dev: 'tag-blue', Engineering: 'tag-orange', Research: 'tag-green' };

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const NewsColumn = ({ article }) => (
  <div className="news-card">
    <div className={`news-img ${bgMap[article.category] || 'tech'}`}>
      {emojiMap[article.category] || '📰'}
    </div>
    <div className="news-body">
      <div className="news-source">
        {article.source} &nbsp;
        <span className={`tag ${tagMap[article.category] || 'tag-gray'}`} style={{ fontSize: '0.68rem' }}>
          {article.category}
        </span>
      </div>
      <div className="news-title">{article.title}</div>
      {article.description && <div className="news-desc">{article.description}</div>}
      <div className="news-time">{timeAgo(article.pubDate)}</div>
    </div>
  </div>
);

export default NewsColumn;
