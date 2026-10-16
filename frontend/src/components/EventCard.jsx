import React from 'react';

const EventCard = ({ event }) => {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();

  const handleRegister = () => {
    if (event.applyLink) window.open(event.applyLink, '_blank');
    else alert(`✅ Registered for ${event.title}!`);
  };

  return (
    <div className="event-card">
      <div className="event-date-box">
        <div className="event-date-d">{day}</div>
        <div className="event-date-m">{month}</div>
      </div>
      <div className="event-info">
        <div className="event-title">{event.title}</div>
        <div className="event-meta">
          <span>🏛️ {event.organizer}</span>
          <span>📍 {event.venue}</span>
          <span>⏰ {event.time}</span>
          <span className={`tag tag-${event.mode === 'Online' ? 'blue' : event.mode === 'Offline' ? 'gray' : 'purple'}`} style={{ fontSize: '0.72rem' }}>
            {event.mode}
          </span>
        </div>
        <div className="tags">
          {event.branches?.slice(0, 3).map(b => <span key={b} className="tag tag-cyan">{b}</span>)}
          <span className="tag tag-orange">{event.category}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 90 }}>
        <span className={event.registrationFee === 0 ? 'price-free' : 'price-paid'}>
          {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
        </span>
        <button className="btn btn-outline" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default EventCard;
