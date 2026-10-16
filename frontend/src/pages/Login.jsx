import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AIDS', 'AIML', 'DS', 'Other'];

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', branch: 'CSE', year: '1', skills: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const skills = regData.skills.split(',').map(s => s.trim()).filter(Boolean);
      await register({ ...regData, year: parseInt(regData.year), skills });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Edu<span>Nexus</span></div>
        <div className="auth-tagline">Your campus. Your opportunities. All in one place.</div>

        <div className="tab-switcher">
          <button className={`tab-switch${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab-switch${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', padding: '0.65rem 1rem', borderRadius: 10, marginBottom: '1rem', fontSize: '0.83rem' }}>{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input className="form-input" type="email" placeholder="you@university.edu" required
                value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input className="form-input" type="password" placeholder="••••••••" required
                value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
            </div>
            <button className="btn-auth" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : '🔑 Login to EduNexus'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input className="form-input" placeholder="Rahul Sharma" required
                value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input className="form-input" type="email" placeholder="you@university.edu" required
                value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">BRANCH</label>
                <select className="form-select" value={regData.branch} onChange={e => setRegData({ ...regData, branch: e.target.value })}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">YEAR</label>
                <select className="form-select" value={regData.year} onChange={e => setRegData({ ...regData, year: e.target.value })}>
                  {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">SKILLS (comma separated)</label>
              <input className="form-input" placeholder="React, Python, Machine Learning…"
                value={regData.skills} onChange={e => setRegData({ ...regData, skills: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" required minLength={6}
                value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />
            </div>
            <button className="btn-auth" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : '🚀 Create Account'}
            </button>
          </form>
        )}

        <div className="auth-switch">
          {tab === 'login'
            ? <>Don't have an account? <a onClick={() => setTab('register')}>Register here</a></>
            : <>Already have an account? <a onClick={() => setTab('login')}>Login here</a></>}
        </div>
      </div>
    </div>
  );
};

export default Login;
