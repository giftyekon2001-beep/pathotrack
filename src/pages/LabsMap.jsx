import React, { useEffect, useState } from 'react';
import { labAPI } from '../services/api';
import '../styles/labs-map.css';

export default function LabsMap() {
  const [laboratories, setLaboratories] = useState([]);
  const [nearbyLabs, setNearbyLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    fetchLaboratories();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyLabs();
    }
  }, [userLocation, radius]);

  const fetchLaboratories = async () => {
    try {
      const response = await labAPI.getAllLabs();
      setLaboratories(response.data);
    } catch (err) {
      setError('Failed to fetch laboratories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => console.log('Geolocation not available')
      );
    }
  };

  const fetchNearbyLabs = async () => {
    try {
      const response = await labAPI.getNearbyLabs(
        userLocation.latitude,
        userLocation.longitude,
        radius
      );
      setNearbyLabs(response.data);
    } catch (err) {
      console.error('Failed to fetch nearby labs', err);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  if (loading) return <div className="loading">Loading laboratories...</div>;

  const displayedLabs = selectedTab === 'nearby' ? nearbyLabs : laboratories;

  return (
    <div className="labs-map">
      <div className="container">
        <div className="labs-header">
          <h1>Find Laboratories</h1>
          <p>Locate nearby laboratories for testing and diagnosis</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="labs-controls">
          <div className="tabs">
            <button
              className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              All Laboratories ({laboratories.length})
            </button>
            {userLocation && (
              <button
                className={`tab ${selectedTab === 'nearby' ? 'active' : ''}`}
                onClick={() => setSelectedTab('nearby')}
              >
                Nearby ({nearbyLabs.length})
              </button>
            )}
          </div>

          {selectedTab === 'nearby' && (
            <div className="radius-control">
              <label htmlFor="radius">Radius: {radius} km</label>
              <input
                type="range"
                id="radius"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="labs-grid">
          {displayedLabs.length > 0 ? (
            displayedLabs.map(lab => (
              <div key={lab.id} className="lab-card">
                <div className="lab-header">
                  <h3>{lab.name}</h3>
                  {selectedTab === 'nearby' && (
                    <span className="distance-badge">
                      {calculateDistance(userLocation.latitude, userLocation.longitude, lab.latitude, lab.longitude)} km
                    </span>
                  )}
                </div>

                <div className="lab-info">
                  {lab.address && (
                    <p><strong>📍 Address:</strong> {lab.address}</p>
                  )}
                  {lab.phone && (
                    <p><strong>📞 Phone:</strong> {lab.phone}</p>
                  )}
                  {lab.email && (
                    <p><strong>📧 Email:</strong> {lab.email}</p>
                  )}
                  {lab.openingHours && (
                    <p><strong>🕐 Hours:</strong> {lab.openingHours}</p>
                  )}
                  {lab.capabilities && (
                    <p><strong>🔬 Capabilities:</strong> {lab.capabilities}</p>
                  )}
                </div>

                <div className="lab-actions">
                  {lab.phone && (
                    <a href={`tel:${lab.phone}`} className="btn btn-primary btn-sm">
                      Call
                    </a>
                  )}
                  {lab.latitude && lab.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${lab.latitude},${lab.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Directions
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No laboratories found in this area. Try increasing the search radius.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}