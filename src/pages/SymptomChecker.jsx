import React, { useState } from 'react';
import { symptomAPI } from '../services/api';
import '../styles/symptom-checker.css';

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleCheck = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await symptomAPI.checkSymptoms(selectedSymptoms);
      setResults(response.data);
    } catch (err) {
      setError('Failed to check symptoms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker">
      <div className="container">
        <div className="checker-card">
          <h1>Symptom Checker</h1>
          <p className="subtitle">Select your symptoms to get possible infection suggestions</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="symptoms-section">
            <h2>Select Your Symptoms</h2>
            <div className="symptoms-grid">
              {symptoms.map(symptom => (
                <button
                  key={symptom}
                  className={`symptom-btn ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="selected-summary">
            <p>Selected: {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''}</p>
            {selectedSymptoms.length > 0 && (
              <div className="selected-list">
                {selectedSymptoms.map(symptom => (
                  <span key={symptom} className="badge badge-info">
                    {symptom}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>

          {results && (
            <div className="results-section">
              <h2>Possible Infections</h2>
              <p className="disclaimer">{results.disclaimer}</p>

              <div className="infections-list">
                {results.possibleInfections.map((infection, idx) => (
                  <div key={idx} className="infection-card">
                    <div className="infection-header">
                      <h3>{infection.infection}</h3>
                      <span className={`badge badge-${infection.severity === 'high' ? 'danger' : infection.severity === 'medium' ? 'warning' : 'success'}`}>
                        {infection.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="description">{infection.description}</p>

                    <div className="confidence">
                      <label>Confidence Level</label>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: `${infection.confidence}%` }}></div>
                      </div>
                      <span>{infection.confidence}%</span>
                    </div>

                    <div className="tests">
                      <label>Recommended Tests:</label>
                      <ul>
                        {infection.recommendedTests.map((test, i) => (
                          <li key={i}>{test}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="measures">
                      <label>Preventive Measures:</label>
                      <p>{infection.preventiveMeasures}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="next-steps">
                <h3>Next Steps</h3>
                <ol>
                  <li>Consult with a healthcare professional for accurate diagnosis</li>
                  <li>Visit a nearby laboratory for testing</li>
                  <li>Share your test results with public health authorities if needed</li>
                  <li>Follow treatment recommendations from your healthcare provider</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}