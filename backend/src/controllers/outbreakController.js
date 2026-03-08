import { getQuery, runQuery, allQuery } from '../database.js';

const OUTBREAK_THRESHOLD = 5; // Minimum reports in area for alert
const OUTBREAK_RADIUS_KM = 5; // Radius for clustering

export const detectOutbreaks = async (req, res) => {
  try {
    const outbreakClusters = await analyzeOutbreakPatterns();
    
    res.json({
      outbreaks: outbreakClusters,
      lastChecked: new Date()
    });
  } catch (error) {
    console.error('Detect outbreaks error:', error);
    res.status(500).json({ error: 'Failed to detect outbreaks' });
  }
};

export const getOutbreakAlerts = async (req, res) => {
  try {
    const alerts = await allQuery(
      `SELECT id, location, latitude, longitude, infectionType, reportCount, severity, description, status, createdAt
       FROM outbreak_alerts
       WHERE status = 'active'
       ORDER BY createdAt DESC`
    );

    res.json(alerts);
  } catch (error) {
    console.error('Get outbreak alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const analyzeOutbreakPatterns = async () => {
  try {
    const allReports = await allQuery(
      `SELECT id, symptoms, location, latitude, longitude, severity, createdAt
       FROM symptom_reports
       WHERE status = 'active'
       AND createdAt > datetime('now', '-30 days')`
    );

    const infectionClusters = {};

    allReports.forEach(report => {
      const symptoms = JSON.parse(report.symptoms);
      const key = `${Math.round(report.latitude || 0)}_${Math.round(report.longitude || 0)}`;
      
      if (!infectionClusters[key]) {
        infectionClusters[key] = {
          location: report.location || 'Unknown',
          latitude: report.latitude,
          longitude: report.longitude,
          infections: {},
          totalReports: 0
        };
      }

      infectionClusters[key].totalReports += 1;

      symptoms.forEach(symptom => {
        const normalized = symptom.toLowerCase().replace(/\s+/g, '_');
        if (!infectionClusters[key].infections[normalized]) {
          infectionClusters[key].infections[normalized] = 0;
        }
        infectionClusters[key].infections[normalized] += 1;
      });
    });

    const alerts = [];

    for (const [key, cluster] of Object.entries(infectionClusters)) {
      for (const [infection, count] of Object.entries(cluster.infections)) {
        if (count >= OUTBREAK_THRESHOLD) {
          const severity = count >= 20 ? 'high' : count >= 10 ? 'medium' : 'low';
          
          alerts.push({
            location: cluster.location,
            latitude: cluster.latitude,
            longitude: cluster.longitude,
            infectionType: infection,
            reportCount: count,
            severity,
            description: `Possible ${infection} cluster detected with ${count} reports in the last 30 days`
          });
        }
      }
    }

    // Update database with alerts
    await updateOutbreakAlerts(alerts);

    return alerts;
  } catch (error) {
    console.error('Analyze outbreak patterns error:', error);
    return [];
  }
};

const updateOutbreakAlerts = async (newAlerts) => {
  try {
    // Clear old inactive alerts
    await runQuery(
      `UPDATE outbreak_alerts
       SET status = 'resolved', resolvedAt = CURRENT_TIMESTAMP
       WHERE status = 'active'
       AND createdAt < datetime('now', '-30 days')`
    );

    // Add new alerts
    for (const alert of newAlerts) {
      const existing = await getQuery(
        `SELECT id FROM outbreak_alerts
         WHERE location = ? AND infectionType = ? AND status = 'active'`,
        [alert.location, alert.infectionType]
      );

      if (!existing) {
        await runQuery(
          `INSERT INTO outbreak_alerts (location, latitude, longitude, infectionType, reportCount, severity, description, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
          [alert.location, alert.latitude, alert.longitude, alert.infectionType, alert.reportCount, alert.severity, alert.description]
        );
      } else {
        await runQuery(
          `UPDATE outbreak_alerts
           SET reportCount = ?, severity = ?, description = ?
           WHERE id = ?`,
          [alert.reportCount, alert.severity, alert.description, existing.id]
        );
      }
    }
  } catch (error) {
    console.error('Update outbreak alerts error:', error);
  }
};

export const getTrendData = async (req, res) => {
  try {
    const { days = 30, location } = req.query;

    let query = `
      SELECT 
        DATE(createdAt) as date,
        symptoms,
        COUNT(*) as count
      FROM symptom_reports
      WHERE createdAt > datetime('now', '-' || ? || ' days')
      AND status = 'active'
    `;
    const params = [days];

    if (location) {
      query += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }

    query += ` GROUP BY DATE(createdAt), symptoms ORDER BY date DESC`;

    const trends = await allQuery(query, params);

    const formattedTrends = trends.map(trend => ({
      date: trend.date,
      symptoms: JSON.parse(trend.symptoms),
      count: trend.count
    }));

    res.json(formattedTrends);
  } catch (error) {
    console.error('Get trend data error:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
};