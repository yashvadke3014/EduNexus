import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const CATS = ['All', 'Workshop', 'Seminar', 'Webinar', 'Technical', 'Cultural', 'Sports'];
const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AIDS'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [branch, setBranch] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.append('category', category);
    if (branch !== 'All') params.append('branch', branch);
    axios.get(`/api/events?${params}`)
      .then(r => setEvents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, branch]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>🎯 Events</h1>
          <p>Workshops, seminars, webinars, and campus events near you.</p>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Category:</span>
        {CATS.map(c => (
          <button key={c} className={`chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
        <select className="select-filter" value={branch} onChange={e => setBranch(e.target.value)}>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="container section">
        {loading && <div className="empty"><div className="empty-icon">⏳</div>Loading…</div>}
        {!loading && events.length === 0 && <div className="empty"><div className="empty-icon">🔍</div>No events found.</div>}
        <div className="event-list">
          {events.map(e => <EventCard key={e._id} event={e} />)}
        </div>
      </div>
    </div>
  );
};

export default Events;
