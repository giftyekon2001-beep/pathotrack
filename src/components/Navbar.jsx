import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiHome, FiCheckCircle, FiMap, FiBook, FiSettings } from 'react-icons/fi';
import '../styles/navbar.css';

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🔬</span>
          PathoTrack
        </Link>

        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
                <FiHome /> Home
              </Link>
            </li>

            {user ? (
              <>
                {user.role === 'community' && (
                  <>
                    <li className="navbar-item">
                      <Link to="/symptom-checker" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <FiCheckCircle /> Symptom Checker
                      </Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/report-symptoms" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <FiCheckCircle /> Report Symptoms
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'laboratory' && (
                  <>
                    <li className="navbar-item">
                      <Link to="/lab-dashboard" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <FiSettings /> Lab Dashboard
                      </Link>
                    </li>
                  </>
                )}

                <li className="navbar-item">
                  <Link to="/labs-map" className="navbar-link" onClick={() => setIsOpen(false)}>
                    <FiMap /> Find Labs
                  </Link>
                </li>

                <li className="navbar-item">
                  <Link to="/education" className="navbar-link" onClick={() => setIsOpen(false)}>
                    <FiBook /> Education
                  </Link>
                </li>

                <li className="navbar-item">
                  <Link to="/outbreaks" className="navbar-link" onClick={() => setIsOpen(false)}>
                    <FiMap /> Outbreaks
                  </Link>
                </li>

                <li className="navbar-item">
                  <button className="btn-logout" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-item">
                  <Link to="/login" className="navbar-link" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/register" className="navbar-link navbar-link-btn" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}