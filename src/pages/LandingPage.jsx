import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMap, FiBook, FiTrendingUp } from 'react-icons/fi';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>PathoTrack</h1>
            <p>Early Detection, Community Protection</p>
            <p className="hero-description">
              PathoTrack is a community-driven infection detection and reporting platform that helps identify
              infectious disease trends early through symptom reporting and laboratory result tracking.
            </p>
            <div className="hero-buttons">
              <Link to="/symptom-checker" className="btn btn-primary">
                Start Symptom Check
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle size={40} />
              </div>
              <h3>Symptom Checker</h3>
              <p>Report your symptoms and get possible infection suggestions based on AI-powered analysis</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiMap size={40} />
              </div>
              <h3>Find Nearby Labs</h3>
              <p>Locate nearby laboratories and get their contact information and directions instantly</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp size={40} />
              </div>
              <h3>Outbreak Detection</h3>
              <p>Monitor disease trends in your area and receive alerts about possible outbreak clusters</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiBook size={40} />
              </div>
              <h3>Health Education</h3>
              <p>Learn about infection prevention, food safety, and proper hygiene practices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Report Symptoms</h3>
              <p>Enter your symptoms and location to help track disease patterns</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Get Suggestions</h3>
              <p>Receive possible infection suggestions and recommended tests</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Find Laboratory</h3>
              <p>Locate nearby laboratories and visit for professional testing</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Share Results</h3>
              <p>Laboratories share results to help detect outbreak patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>Help us detect infections early and protect public health</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 PathoTrack. All rights reserved.</p>
          <p>Helping communities detect infections early | Protecting public health</p>
        </div>
      </footer>
    </div>
  );
}