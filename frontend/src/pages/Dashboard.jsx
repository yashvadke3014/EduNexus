import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) return <div className="page"><div className="empty"><div className="empty-icon">⏳</div>Loading…</div></div>;
  if (!user) return null;

  const stats = [
    { icon: '🏆', num: user.registeredHackathons?.length || 0, label: 'Registered Hackathons', color: '#4F46E5' },
    { icon: '📚', num: user.enrolledCourses?.length || 0, label: 'Enrolled Courses', color: '#0284C7' },
    { icon: '🎯', num: user.savedEvents?.length || 0, label: 'Saved Events', color: '#D97706' },
    { icon: '💼', num: user.savedInternships?.length || 0, label: 'Saved Internships', color: '#059669' },
  ];

  return (
    <div className="page">
      <div className="dash-header">
        <div className="container">
          <div className="dash-hi">
            Welcome back, {user.name?.split(' ')[0]}! 👋
            <span className="branch-badge">{user.branch}</span>
          </div>
          <div className="dash-sub">Here's your activity and upcoming deadlines.</div>
        </div>
      </div>

      <div className="stats-cards">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="activity-grid">
        {/* Profile panel */}
        <div className="activity-panel">
          <div className="panel-title">Your Profile</div>
          {[
            ['Name', user.name],
            ['Email', user.email],
            ['Branch', `${user.branch} — Year ${user.year}`],
            ['Skills', (user.skills || []).join(', ') || 'Not set'],
            ['Role', user.role],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #F8FAFC', fontSize: '0.83rem' }}>
              <span style={{ color: '#64748B' }}>{label}</span>
              <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: 200 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/hackathons" className="btn btn-filled" style={{ textAlign: 'center', width: '100%' }}>🏆 Find Hackathons</Link>
            <Link to="/internships" className="btn btn-green" style={{ textAlign: 'center', width: '100%' }}>💼 Browse Internships</Link>
          </div>
        </div>

        {/* Activity panel */}
        <div className="activity-panel">
          <div className="panel-title">Quick Actions</div>
          {[
            { icon: '🏆', bg: '#EDE9FE', title: `Hackathons for ${user.branch}`, sub: 'View personalized hackathons', link: '/hackathons' },
            { icon: '💼', bg: '#D1FAE5', title: 'Ranked Internships', sub: 'Based on your branch & skills', link: '/internships' },
            { icon: '📚', bg: '#DBEAFE', title: 'Recommended Courses', sub: 'Curated for your branch', link: '/courses' },
            { icon: '🤖', bg: '#FEF3C7', title: 'Ask NexBot', sub: 'Get personalized suggestions', link: '/' },
          ].map(a => (
            <div key={a.title} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => navigate(a.link)}>
              <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div className="act-info"><h5>{a.title}</h5><p>{a.sub}</p></div>
            </div>
          ))}
        </div>

        {/* Skills panel */}
        <div className="activity-panel">
          <div className="panel-title">Your Skills</div>
          {user.skills?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {user.skills.map(s => <span key={s} className="tag tag-purple">{s}</span>)}
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>No skills listed yet.</p>
          )}
          <div className="panel-title" style={{ marginTop: '1rem' }}>Branch</div>
          <span className="tag tag-cyan" style={{ fontSize: '0.85rem' }}>{user.branch}</span>
          <div className="panel-title" style={{ marginTop: '1rem' }}>Year</div>
          <span className="tag tag-blue">Year {user.year}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
