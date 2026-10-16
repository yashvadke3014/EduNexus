import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecommendationEngine from '../components/RecommendationEngine';

const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AIDS'];

const calcScore = (intern, user) => {
  if (!user) return 0;
  let s = 0;
  if (intern.branches?.includes('All')) s += 1;
  if (intern.branches?.includes(user.branch)) s += 5;
  (user.skills || []).forEach(skill => {
    if (intern.skills?.map(sk => sk.toLowerCase()).includes(skill.toLowerCase())) s += 2;
  });
  return Math.min(s, 10);
};

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [personalized, setPersonalized] = useState(false);
  const [branch, setBranch] = useState('All');
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (branch !== 'All') params.append('branch', branch);
    if (mode) params.append('mode', mode);
    axios.get(`/api/internships?${params}`)
      .then(r => {
        setInternships(r.data.internships || r.data);
        setPersonalized(r.data.personalized || false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [branch, mode]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>💼 Internships {user && <span className="ranked-badge">✨ Ranked for You</span>}</h1>
          <p>Personalized internship opportunities based on your branch and skills.</p>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Branch:</span>
        {BRANCHES.map(b => (
          <button key={b} className={`chip${branch === b ? ' active' : ''}`} onClick={() => setBranch(b)}>{b}</button>
        ))}
        <select className="select-filter" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="">All Modes</option>
          <option>Remote</option><option>On-site</option><option>Hybrid</option>
        </select>
      </div>

      {personalized && (
        <div className="personalized-note">
          ✨ Results ranked by branch match and skill overlap — best matches shown first.
        </div>
      )}

      <div className="container section">
        {loading && <div className="empty"><div className="empty-icon">⏳</div>Loading…</div>}
        {!loading && internships.length === 0 && <div className="empty"><div className="empty-icon">🔍</div>No internships found.</div>}
        <div className="grid">
          {internships.map(i => {
            const score = calcScore(i, user);
            return (
              <div key={i._id} className="card">
                <div className="card-top" style={{ background: 'linear-gradient(90deg,#059669,#10B981)' }} />
                <div className="card-body">
                  {user && <RecommendationEngine score={score} maxScore={10} label="Match" />}
                  <div className="tags">
                    <span className="tag tag-green">{i.status}</span>
                    <span className="tag tag-blue">{i.mode}</span>
                  </div>
                  <div className="card-title">{i.title}</div>
                  <div className="card-subtitle" style={{ color: '#4F46E5', fontWeight: 600 }}>{i.company}</div>
                  <div className="card-meta">
                    <span>📍 {i.location}</span>
                    <span>💰 {i.stipend}</span>
                    <span>⏱ {i.duration}</span>
                    {i.applicationDeadline && <span>⏰ Apply by {new Date(i.applicationDeadline).toDateString()}</span>}
                  </div>
                  <div className="tags">{i.branches?.slice(0, 3).map(b => <span key={b} className="tag tag-cyan">{b}</span>)}</div>
                  <div className="card-footer">
                    <div className="tags">{i.skills?.slice(0, 2).map(s => <span key={s} className="tag tag-gray">{s}</span>)}</div>
                    <a href={i.applyLink || '#'} target="_blank" rel="noreferrer" className="btn btn-filled">Apply Now →</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Internships;
