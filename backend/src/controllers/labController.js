import { getQuery, runQuery, allQuery } from '../database.js';

export const registerLaboratory = async (req, res) => {
  try {
    const { name, address, latitude, longitude, phone, email, openingHours, capabilities } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Laboratory name required' });
    }

    // Check if lab already exists for this user
    const existing = await getQuery('SELECT id FROM laboratories WHERE userId = ?', [req.user.userId]);
    if (existing) {
      return res.status(400).json({ error: 'Laboratory already registered for this account' });
    }

    const result = await runQuery(
      `INSERT INTO laboratories (userId, name, address, latitude, longitude, phone, email, openingHours, capabilities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.userId, name, address || null, latitude || null, longitude || null, phone || null, email || null, openingHours || null, capabilities || null]
    );

    res.status(201).json({
      message: 'Laboratory registered successfully',
      labId: result.lastID
    });
  } catch (error) {
    console.error('Register lab error:', error);
    res.status(500).json({ error: 'Failed to register laboratory' });
  }
};

export const uploadLabResult = async (req, res) => {
  try {
    const { testType, organism, location, latitude, longitude, specimen, notes } = req.body;

    if (!testType) {
      return res.status(400).json({ error: 'Test type required' });
    }

    const result = await runQuery(
      `INSERT INTO lab_results (labId, testType, organism, location, latitude, longitude, specimen, notes, resultDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [req.user.userId, testType, organism || null, location || null, latitude || null, longitude || null, specimen || null, notes || null]
    );

    res.status(201).json({
      message: 'Lab result uploaded successfully',
      resultId: result.lastID
    });
  } catch (error) {
    console.error('Upload lab result error:', error);
    res.status(500).json({ error: 'Failed to upload lab result' });
  }
};

export const getLabResults = async (req, res) => {
  try {
    const results = await allQuery(
      `SELECT id, testType, organism, location, latitude, longitude, specimen, notes, resultDate, createdAt
       FROM lab_results
       WHERE labId = ?
       ORDER BY resultDate DESC`,
      [req.user.userId]
    );

    res.json(results);
  } catch (error) {
    console.error('Get lab results error:', error);
    res.status(500).json({ error: 'Failed to fetch lab results' });
  }
};

export const getAllLaboratories = async (req, res) => {
  try {
    const labs = await allQuery(
      `SELECT l.id, l.name, l.address, l.latitude, l.longitude, l.phone, l.email, l.openingHours, l.capabilities, l.createdAt
       FROM laboratories l
       ORDER BY l.name ASC`
    );

    res.json(labs);
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ error: 'Failed to fetch laboratories' });
  }
};

export const getNearbyLaboratories = async (req, res) => {
  try {
    const { latitude, longitude, radiusKm = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Get all labs and calculate distance (simplified)
    const labs = await allQuery(
      `SELECT l.id, l.name, l.address, l.latitude, l.longitude, l.phone, l.email, l.openingHours, l.capabilities
       FROM laboratories l`
    );

    const nearby = labs
      .map(lab => ({
        ...lab,
        distance: calculateDistance(lat, lng, lab.latitude, lab.longitude)
      }))
      .filter(lab => lab.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearby);
  } catch (error) {
    console.error('Get nearby labs error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby laboratories' });
  }
};

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};