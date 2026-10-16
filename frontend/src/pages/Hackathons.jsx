import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HackathonCard from '../components/HackathonCard';

const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AIDS', 'AIML'];

const Hackathons = () => {
  const [tab, setTab] = useState('Upcoming');
  const [hackathons, setHackathons] = useState([]);
  const [winners, setWinners] = useState([]);
  const [branch, setBranch] = useState('All');
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'Winners') {
      axios.get('/api/hackathons/public/winners').then(r => setWinners(r.data)).catch(() => {});
    } else {
      setLoading(true);
      const params = new URLSearchParams({ status: tab });
      if (branch !== 'All') params.append('branch', branch);
      if (mode) params.append('mode', mode);
      axios.get(`/api/hackathons?${params}`)
        .then(r => setHackathons(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab, branch, mode]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>🏆 Hackathons</h1>
          <p>Compete, build, and win. Find hackathons for your branch.</p>
        </div>
      </div>

      <div className="tab-row">
        {['Upcoming', 'Ongoing', 'Winners'].map(t => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'Upcoming' ? '📅' : t === 'Ongoing' ? '🔴' : '🏅'} {t}
          </button>
        ))}
      </div>

      {tab !== 'Winners' && (
        <div className="filter-bar">
          <span className="filter-label">Branch:</span>
          {BRANCHES.map(b => (
            <button key={b} className={`chip${branch === b ? ' active' : ''}`} onClick={() => setBranch(b)}>{b}</button>
          ))}
          <select className="select-filter" value={mode} onChange={e => setMode(e.target.value)}>
            <option value="">All Modes</option>
            <option>Online</option><option>Offline</option><option>Hybrid</option>
          </select>
        </div>
      )}

      <div className="container section">
        {loading && <div className="empty"><div className="empty-icon">⏳</div>Loading…</div>}

        {tab === 'Winners' ? (
          winners.length === 0
            ? <div className="empty"><div className="empty-icon">🏅</div>No winners data yet.</div>
            : <div className="grid">{winners.map(h => <HackathonCard key={h._id} hackathon={h} />)}</div>
        ) : (
          hackathons.length === 0 && !loading
            ? <div className="empty"><div className="empty-icon">🔍</div>No hackathons found for this filter.</div>
            : <div className="grid">{hackathons.map(h => <HackathonCard key={h._id} hackathon={h} />)}</div>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
