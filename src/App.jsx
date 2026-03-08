import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginRegister from './pages/LoginRegister';
import SymptomChecker from './pages/SymptomChecker';
import ReportSymptoms from './pages/ReportSymptoms';
import LabsMap from './pages/LabsMap';
import Education from './pages/Education';
import Outbreaks from './pages/Outbreaks';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/report-symptoms" element={user ? <ReportSymptoms /> : <LoginRegister />} />
          <Route path="/labs-map" element={<LabsMap />} />
          <Route path="/education" element={<Education />} />
          <Route path="/outbreaks" element={<Outbreaks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;