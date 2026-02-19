import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Leaf,
  MessageCircle,
  BookOpen,
  Wind,
  Gamepad2,
  Mail,
  LogOut,
  User,
  Palette
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, themes } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Leaf className="logo-icon" /> <span>InnerLight</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <span className="link-text">Home</span>
          </Link>
          <Link to="/share" className="navbar-link">
            <span className="link-text">Share</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/journal" className="navbar-link">
                <span className="link-text">Journal</span>
              </Link>
              <Link to="/calm" className="navbar-link">
                <span className="link-text">Calm</span>
              </Link>
              <Link to="/mood" className="navbar-link">
                <span className="link-text">Mood</span>
              </Link>
            </>
          ) : null}

          <Link to="/games" className="navbar-link">
            <span className="link-text">Games</span>
          </Link>
          <Link to="/contact" className="navbar-link">
            <span className="link-text">Contact</span>
          </Link>

          <div className="theme-switcher">
            <div className="theme-dropdown">
              <Palette size={20} className="theme-icon" />
              <div className="theme-options">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-dot ${theme === t.id ? 'active' : ''}`}
                    style={{ backgroundColor: t.color }}
                    onClick={() => toggleTheme(t.id)}
                    title={t.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="navbar-logout-btn">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="navbar-link-btn login-btn">Login</Link>
              <Link to="/signup" className="navbar-link-btn signup-btn">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
