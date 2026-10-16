import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsColumn from '../components/NewsColumn';

const CATS = ['All', 'Tech', 'Dev', 'Engineering', 'Research'];

const News = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = category !== 'All' ? `?category=${category}` : '';
    axios.get(`/api/news${params}`)
      .then(r => setArticles(r.data.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>📰 Tech News</h1>
          <p>Latest in technology, AI, and engineering — via live RSS feeds. No API key required.</p>
        </div>
      </div>

      <div className="filter-bar">
        {CATS.map(c => (
          <button key={c} className={`chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
            {c === 'Tech' ? '💻 ' : c === 'Dev' ? '🧑‍💻 ' : c === 'Engineering' ? '⚙️ ' : c === 'Research' ? '🔬 ' : ''}{c}
          </button>
        ))}
      </div>

      <div className="container section">
        {loading && <div className="empty"><div className="empty-icon">⏳</div>Fetching latest news…</div>}
        {!loading && articles.length === 0 && (
          <div className="empty">
            <div className="empty-icon">📡</div>
            <p>Could not load news right now. RSS feeds may be unavailable.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#94A3B8' }}>This works when the backend server is running with internet access.</p>
          </div>
        )}
        <div className="news-grid">
          {articles.map((a, i) => <NewsColumn key={i} article={a} />)}
        </div>
      </div>
    </div>
  );
};

export default News;
