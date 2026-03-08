import React, { useEffect, useState } from 'react';
import { outbreakAPI } from '../services/api';
import '../styles/outbreaks.css';

export default function Outbreaks() {
  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    fetchOutbreakData();
  }, [selectedDays]);

  const fetchOutbreakData = async () => {
    try {
      const [alertsRes, trendsRes] = await Promise.all([
        outbreakAPI.getAlerts(),
        outbreakAPI.getTrends(selectedDays)
      ]);
      setAlerts(alertsRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      console.error('Failed to fetch outbreak data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading outbreak data...</div>;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="outbreaks">
      <div className="container">
        <div className="outbreaks-header">
          <h1>Disease Outbreak Monitoring</h1>
          <p>Track disease trends and outbreak alerts in your area</p>
        </div>

        <div className="alerts-section">
          <h2>Active Outbreak Alerts</h2>
          {alerts.length > 0 ? (
            <div className="alerts-grid">
              {alerts.map(alert => (
                <div key={alert.id} className="alert-card">
                  <div className="alert-header">
                    <h3>{alert.infectionType}</h3>
                    <span className={`severity-badge severity-${alert.severity}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="alert-info">
                    <p><strong>📍 Location:</strong> {alert.location}</p>
                    <p><strong>📊 Reports:</strong> {alert.reportCount} cases</p>
                    <p className="alert-description">{alert.description}</p>
                  </div>

                  <div className="alert-date">
                    <small>Detected: {new Date(alert.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>✓ No active outbreak alerts detected</p>
            </div>
          )}
        </div>

        <div className="trends-section">
          <h2>Disease Trends ({selectedDays} days)</h2>
          
          <div className="trends-filter">
            <label htmlFor="days">Time Period:</label>
            <select
              id="days"
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {trends.length > 0 ? (
            <div className="trends-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Symptoms</th>
                    <th>Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.slice(0, 20).map((trend, idx) => (
                    <tr key={idx}>
                      <td>{new Date(trend.date).toLocaleDateString()}</td>
                      <td>
                        <div className="symptoms-list">
                          {trend.symptoms.map((symptom, i) => (
                            <span key={i} className="symptom-tag">{symptom}</span>
                          ))}
                        </div>
                      </td>
                      <td><strong>{trend.count}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No trend data available for the selected period</p>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>Public Health Information</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>What to do if you suspect an infection</h3>
              <ol>
                <li>Monitor your symptoms</li>
                <li>Get tested at a nearby laboratory</li>
                <li>Self-isolate if necessary</li>
                <li>Follow healthcare provider recommendations</li>
              </ol>
            </div>

            <div className="info-card">
              <h3>Infection prevention tips</h3>
              <ul>
                <li>Wash hands frequently with soap and water</li>
                <li>Maintain proper hygiene</li>
                <li>Use insect repellent and nets</li>
                <li>Ensure safe drinking water</li>
                <li>Keep vaccinations up to date</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>When to seek immediate medical help</h3>
              <ul>
                <li>High fever (39°C or above)</li>
                <li>Severe dehydration</li>
                <li>Difficulty breathing</li>
                <li>Altered consciousness</li>
                <li>Persistent vomiting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}