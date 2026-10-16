import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const FEATURES = [
  { icon: '🏆', title: 'Hackathons', desc: 'Register for coding competitions. Win prizes. Build your portfolio.', link: '/hackathons', color: '#4F46E5' },
  { icon: '💼', title: 'Internships', desc: 'Branch-specific internships from top companies, ranked for you.', link: '/internships', color: '#059669' },
  { icon: '📚', title: 'Courses', desc: 'Curated learning paths to boost your skills and get certified.', link: '/courses', color: '#0284C7' },
  { icon: '🎯', title: 'Events', desc: 'Workshops, seminars, webinars and campus events near you.', link: '/events', color: '#D97706' },
  { icon: '📰', title: 'Tech News', desc: 'Stay updated with AI, engineering, and global tech news.', link: '/news', color: '#DC2626' },
  { icon: '🤖', title: 'NexBot Mentor', desc: 'Ask NexBot to suggest the best opportunities for your branch.', link: '/', color: '#7C3AED' },
];

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [internships, setInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/hackathons?status=Upcoming').then(r => setHackathons(r.data.slice(0, 3))).catch(() => {});
    axios.get('/api/internships?status=Open').then(r => setInternships((r.data.internships || r.data).slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Built for Engineering Students</div>
          <h1>Your Campus.<br /><span className="highlight">Your Opportunities.</span></h1>
          <p>One platform for hackathons, internships, courses, and events — personalized to your branch of engineering.</p>
          <div className="hero-btns">
            <Link to="/hackathons" className="btn-primary">🏆 Explore Hackathons</Link>
            <Link to="/internships" className="btn-secondary">💼 Find Internships</Link>
            <Link to="/news" className="btn-secondary">📰 Tech News</Link>
          </div>
        </div>
        <div className="stats-bar">
          {[['500+', 'Events'], ['200+', 'Hackathons'], ['1,000+', 'Internships'], ['300+', 'Courses'], ['50k+', 'Students']].map(([n, l]) => (
            <div key={l} className="stat"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="container section">
        <div className="section-header">
          <div><div className="section-title">Everything You Need</div><div className="section-sub">One place for all your engineering opportunities</div></div>
        </div>
        <div className="feature-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card" onClick={() => navigate(f.link)}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <div className="feature-link" style={{ color: f.color }}>Explore {f.title} →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Hackathons */}
      {hackathons.length > 0 && (
        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <div><div className="section-title">🏆 Upcoming Hackathons</div><div className="section-sub">Competitions open for registration</div></div>
            <Link to="/hackathons" className="see-all">View All</Link>
          </div>
          <div className="grid">
            {hackathons.map(h => <HackathonCard key={h._id} hackathon={h} />)}
          </div>
        </div>
      )}

      {/* Featured Internships */}
      {internships.length > 0 && (
        <div className="container section" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
          <div className="section-header">
            <div><div className="section-title">💼 Open Internships</div><div className="section-sub">Currently accepting applications</div></div>
            <Link to="/internships" className="see-all">View All</Link>
          </div>
          <div className="grid">
            {internships.map(i => (
              <div key={i._id} className="card">
                <div className="card-top" style={{ background: 'linear-gradient(90deg,#059669,#10B981)' }} />
                <div className="card-body">
                  <div className="tags">
                    <span className="tag tag-green">{i.status}</span>
                    <span className="tag tag-blue">{i.mode}</span>
                  </div>
                  <div className="card-title">{i.title}</div>
                  <div className="card-subtitle" style={{ color: '#4F46E5', fontWeight: 600 }}>{i.company}</div>
                  <div className="card-meta">
                    <span>📍 {i.location}</span>
                    <span>💰 {i.stipend}</span>
                  </div>
                  <div className="card-footer">
                    <div className="tags">{i.branches?.slice(0, 2).map(b => <span key={b} className="tag tag-cyan">{b}</span>)}</div>
                    <a href={i.applyLink || '#'} target="_blank" rel="noreferrer" className="btn btn-filled">Apply →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
