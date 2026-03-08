import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { symptomAPI } from '../services/api';
import '../styles/report-symptoms.css';

export default function ReportSymptoms() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: [],
    duration: '',
    durationUnit: 'days',
    location: '',
    latitude: null,
    longitude: null,
    severity: 'moderate',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const symptoms = [
    'Fever',
    'Abdominal Pain',
    'Diarrhea',
    'Rash',
    'Painful Urination',
    'Vomiting',
    'Cough',
    'Headache'
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        () => console.log('Geolocation not available')
      );
    }
  }, []);

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.symptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);

    try {
      await symptomAPI.reportSymptoms(formData);
      setSuccess('Symptom report submitted successfully!');
      setFormData({
        symptoms: [],
        duration: '',
        durationUnit: 'days',
        location: '',
        latitude: null,
        longitude: null,
        severity: 'moderate',
        additionalNotes: ''
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-symptoms">
      <div className="container">
        <div className="report-card">
          <h1>Report Symptoms</h1>
          <p className="subtitle">Help us detect disease trends by reporting your symptoms</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Select Your Symptoms</h2>
              <div className="symptoms-grid">
                {symptoms.map(symptom => (
                  <label key={symptom} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>Duration</h2>
              <div className="duration-group">
                <div className="form-group">
                  <label htmlFor="duration">How long have you had these symptoms?</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="durationUnit">Unit</label>
                  <select
                    id="durationUnit"
                    name="durationUnit"
                    value={formData.durationUnit}
                    onChange={handleInputChange}
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Location</h2>
              <div className="form-group">
                <label htmlFor="location">Location (City/Area)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your city or area"
                />
              </div>
              {formData.latitude && (
                <div className="location-info">
                  <p>📍 Location coordinates detected</p>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2>Severity</h2>
              <div className="severity-group">
                {['mild', 'moderate', 'severe'].map(level => (
                  <label key={level} className="radio-label">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={formData.severity === level}
                      onChange={handleInputChange}
                    />
                    <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-group">
                <label htmlFor="additionalNotes">Any other symptoms or notes?</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional information"
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}