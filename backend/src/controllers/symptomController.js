import { getQuery, runQuery, allQuery } from '../database.js';

const SYMPTOM_INFECTION_MAP = {
  'fever': ['typhoid', 'malaria', 'cholera', 'dengue'],
  'abdominal_pain': ['typhoid', 'cholera', 'urinary_tract_infection'],
  'diarrhea': ['cholera', 'typhoid', 'gastroenteritis'],
  'rash': ['dengue', 'measles', 'fungal_infection'],
  'painful_urination': ['urinary_tract_infection', 'sexually_transmitted_infection'],
  'vomiting': ['cholera', 'typhoid', 'gastroenteritis'],
  'cough': ['tuberculosis', 'pneumonia', 'influenza'],
  'headache': ['malaria', 'meningitis', 'dengue']
};

const INFECTION_DETAILS = {
  'typhoid': {
    name: 'Typhoid',
    description: 'Bacterial infection caused by Salmonella typhi',
    severity: 'high',
    recommendedTests: ['Widal test', 'Blood culture', 'Stool culture'],
    preventiveMeasures: 'Ensure safe drinking water, proper sanitation, practice good hygiene'
  },
  'cholera': {
    name: 'Cholera',
    description: 'Acute diarrheal disease caused by Vibrio cholerae',
    severity: 'high',
    recommendedTests: ['Stool culture', 'Rapid test'],
    preventiveMeasures: 'Clean drinking water, proper sanitation, vaccination'
  },
  'urinary_tract_infection': {
    name: 'Urinary Tract Infection (UTI)',
    description: 'Bacterial infection of the urinary system',
    severity: 'medium',
    recommendedTests: ['Urine microscopy', 'Urine culture'],
    preventiveMeasures: 'Drink plenty of water, maintain hygiene, urinate regularly'
  },
  'malaria': {
    name: 'Malaria',
    description: 'Parasitic disease transmitted by mosquitoes',
    severity: 'high',
    recommendedTests: ['Blood smear', 'Rapid diagnostic test'],
    preventiveMeasures: 'Use insecticide-treated nets, repellents, seek prompt treatment'
  },
  'dengue': {
    name: 'Dengue Fever',
    description: 'Viral disease transmitted by Aedes mosquitoes',
    severity: 'medium',
    recommendedTests: ['NS1 antigen test', 'IgM/IgG antibody test'],
    preventiveMeasures: 'Mosquito control, use nets and repellents'
  },
  'fungal_infection': {
    name: 'Fungal Infection',
    description: 'Infection caused by fungal organisms',
    severity: 'low',
    recommendedTests: ['KOH mount', 'Fungal culture'],
    preventiveMeasures: 'Keep skin dry, avoid sharing personal items, maintain hygiene'
  },
  'gastroenteritis': {
    name: 'Gastroenteritis',
    description: 'Inflammation of stomach and intestines',
    severity: 'medium',
    recommendedTests: ['Stool test', 'Culture'],
    preventiveMeasures: 'Safe drinking water, proper food handling, good hygiene'
  },
  'tuberculosis': {
    name: 'Tuberculosis (TB)',
    description: 'Serious respiratory infection caused by Mycobacterium tuberculosis',
    severity: 'high',
    recommendedTests: ['Chest X-ray', 'Sputum smear microscopy', 'GeneXpert MTB/RIF'],
    preventiveMeasures: 'BCG vaccination, avoid crowded places, good ventilation'
  },
  'meningitis': {
    name: 'Meningitis',
    description: 'Inflammation of membranes surrounding brain and spinal cord',
    severity: 'high',
    recommendedTests: ['Cerebrospinal fluid (CSF) analysis', 'Blood culture'],
    preventiveMeasures: 'Vaccination, maintain hygiene, avoid close contact with sick persons'
  }
};

export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array required' });
    }

    const infectionScores = {};

    symptoms.forEach(symptom => {
      const normalizedSymptom = symptom.toLowerCase().replace(/\s+/g, '_');
      const possibleInfections = SYMPTOM_INFECTION_MAP[normalizedSymptom] || [];

      possibleInfections.forEach(infection => {
        infectionScores[infection] = (infectionScores[infection] || 0) + 1;
      });
    });

    const suggestions = Object.entries(infectionScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 5)
      .map(([infection, score]) => ({
        infection: INFECTION_DETAILS[infection]?.name || infection,
        description: INFECTION_DETAILS[infection]?.description,
        severity: INFECTION_DETAILS[infection]?.severity,
        confidence: (score / symptoms.length * 100).toFixed(1),
        recommendedTests: INFECTION_DETAILS[infection]?.recommendedTests || [],
        preventiveMeasures: INFECTION_DETAILS[infection]?.preventiveMeasures
      }));

    res.json({
      reportedSymptoms: symptoms,
      possibleInfections: suggestions,
      disclaimer: 'This is for informational purposes only. Please consult a healthcare professional for accurate diagnosis.'
    });
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ error: 'Symptom check failed' });
  }
};

export const reportSymptoms = async (req, res) => {
  try {
    const { symptoms, duration, durationUnit = 'days', location, latitude, longitude, severity = 'moderate', additionalNotes } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array required' });
    }

    const symptomsJson = JSON.stringify(symptoms);

    const result = await runQuery(
      `INSERT INTO symptom_reports (userId, symptoms, duration, durationUnit, location, latitude, longitude, severity, additionalNotes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.userId, symptomsJson, duration || null, durationUnit, location || null, latitude || null, longitude || null, severity, additionalNotes || null]
    );

    res.status(201).json({
      message: 'Symptom report submitted successfully',
      reportId: result.lastID
    });
  } catch (error) {
    console.error('Report symptoms error:', error);
    res.status(500).json({ error: 'Failed to report symptoms' });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await allQuery(
      `SELECT id, symptoms, duration, durationUnit, location, latitude, longitude, severity, additionalNotes, status, createdAt
       FROM symptom_reports
       WHERE userId = ?
       ORDER BY createdAt DESC`,
      [req.user.userId]
    );

    const formattedReports = reports.map(report => ({
      ...report,
      symptoms: JSON.parse(report.symptoms)
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getCommunityReports = async (req, res) => {
  try {
    const { location, radius = 10 } = req.query;

    let query = `SELECT id, location, latitude, longitude, symptoms, severity, createdAt
                 FROM symptom_reports
                 WHERE status = 'active'
                 ORDER BY createdAt DESC
                 LIMIT 100`;
    
    const reports = await allQuery(query);

    const formattedReports = reports.map(report => ({
      ...report,
      symptoms: JSON.parse(report.symptoms)
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error('Get community reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};