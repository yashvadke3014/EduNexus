import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Edu<span>Nexus</span></Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/events" className={isActive('/events')}>Events</Link>
        <Link to="/hackathons" className={isActive('/hackathons')}>Hackathons</Link>
        <Link to="/courses" className={isActive('/courses')}>Courses</Link>
        <Link to="/internships" className={isActive('/internships')}>Internships</Link>
        <Link to="/news" className={isActive('/news')}>Tech News</Link>
        {user && <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>}
        {user ? (
          <button className="nav-btn danger" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="nav-btn">Login / Register</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
