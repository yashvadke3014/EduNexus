import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ICONS = { 'Full Stack': '💻', 'Machine Learning': '🤖', 'Embedded': '⚙️', 'Data': '📊', 'Cloud': '☁️', 'Circuit': '🔌' };
const getBannerClass = (title) => {
  if (title.includes('Full Stack') || title.includes('Web')) return 'web';
  if (title.includes('Machine') || title.includes('ML') || title.includes('AI')) return 'ml';
  if (title.includes('Embedded') || title.includes('Circuit')) return 'embedded';
  return 'default';
};
const getIcon = (title) => {
  for (const [k, v] of Object.entries(ICONS)) if (title.includes(k)) return v;
  return '📚';
};

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchCourses = (lvl) => {
    setLoading(true);
    const params = lvl === 'All' ? '' : `?level=${lvl}`;
    axios.get(`/api/courses${params}`)
      .then(r => setCourses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(level); }, [level]);

  const handleEnroll = async (course) => {
    if (!user) return alert('Please login first!');
    if (course.price === 0) {
      alert(`📚 Enrolled in "${course.title}" for free!`);
      return;
    }
    try {
      const { data } = await axios.post('/api/payment/create-order', {
        amount: course.price, type: 'course', itemId: course._id,
      });
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount, currency: 'INR',
        name: 'EduNexus', description: course.title, order_id: data.orderId,
        handler: async (response) => {
          await axios.post('/api/payment/verify', { ...response, type: 'course', itemId: course._id });
          alert('✅ Enrolled successfully!');
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#4F46E5' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>📚 Courses</h1>
          <p>Level up your skills with curated courses for engineering students.</p>
        </div>
      </div>

      <div className="filter-bar">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
          <button key={l} className={`chip${level === l ? ' active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
        ))}
      </div>

      <div className="container section">
        {loading && <div className="empty"><div className="empty-icon">⏳</div>Loading…</div>}
        <div className="grid">
          {courses.map(c => (
            <div key={c._id} className="card">
              <div className={`course-banner ${getBannerClass(c.title)}`}>{getIcon(c.title)}</div>
              <div className="card-body">
                <div className="tags">
                  <span className={`tag ${c.level === 'Beginner' ? 'tag-green' : c.level === 'Intermediate' ? 'tag-blue' : 'tag-red'}`}>{c.level}</span>
                  {c.price === 0 && <span className="tag tag-green">FREE</span>}
                  {c.duration && <span className="tag tag-gray">{c.duration}</span>}
                </div>
                <div className="card-title">{c.title}</div>
                <div className="card-subtitle">👨‍🏫 {c.instructor}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="course-stars">{'★'.repeat(Math.floor(c.rating || 4))}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{c.rating}</span>
                  <span className="course-meta">({(c.totalEnrolled || 0).toLocaleString()} enrolled)</span>
                </div>
                <div className="tags">{c.skills?.slice(0, 3).map(s => <span key={s} className="tag tag-gray">{s}</span>)}</div>
                <div className="card-footer">
                  <span className={c.price === 0 ? 'price-free' : 'price-paid'}>
                    {c.price === 0 ? 'FREE' : `₹${c.price.toLocaleString()}`}
                  </span>
                  <button className="btn btn-filled" onClick={() => handleEnroll(c)}>
                    {c.price === 0 ? 'Enroll Free' : 'Buy & Enroll'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
