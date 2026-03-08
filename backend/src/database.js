import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          role TEXT CHECK(role IN ('community', 'laboratory', 'admin')) DEFAULT 'community',
          location TEXT,
          latitude REAL,
          longitude REAL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Symptoms dictionary
      db.run(`
        CREATE TABLE IF NOT EXISTS symptoms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Infection types
      db.run(`
        CREATE TABLE IF NOT EXISTS infections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          recommendedTests TEXT,
          preventiveMeasures TEXT,
          severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Symptom-Infection mappings
      db.run(`
        CREATE TABLE IF NOT EXISTS symptom_infection_map (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          symptomId INTEGER NOT NULL,
          infectionId INTEGER NOT NULL,
          weight REAL DEFAULT 1.0,
          FOREIGN KEY(symptomId) REFERENCES symptoms(id),
          FOREIGN KEY(infectionId) REFERENCES infections(id),
          UNIQUE(symptomId, infectionId)
        )
      `);

      // Symptom reports
      db.run(`
        CREATE TABLE IF NOT EXISTS symptom_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          symptoms TEXT NOT NULL,
          duration INTEGER,
          durationUnit TEXT DEFAULT 'days',
          location TEXT,
          latitude REAL,
          longitude REAL,
          severity TEXT CHECK(severity IN ('mild', 'moderate', 'severe')),
          additionalNotes TEXT,
          status TEXT DEFAULT 'active',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(userId) REFERENCES users(id)
        )
      `);

      // Laboratory results
      db.run(`
        CREATE TABLE IF NOT EXISTS lab_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          labId INTEGER NOT NULL,
          testType TEXT NOT NULL,
          organism TEXT,
          location TEXT,
          latitude REAL,
          longitude REAL,
          resultDate DATETIME,
          specimen TEXT,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(labId) REFERENCES users(id)
        )
      `);

      // Laboratories
      db.run(`
        CREATE TABLE IF NOT EXISTS laboratories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL UNIQUE,
          name TEXT NOT NULL,
          address TEXT,
          latitude REAL,
          longitude REAL,
          phone TEXT,
          email TEXT,
          openingHours TEXT,
          capabilities TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(userId) REFERENCES users(id)
        )
      `);

      // Outbreak alerts
      db.run(`
        CREATE TABLE IF NOT EXISTS outbreak_alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          infectionType TEXT NOT NULL,
          reportCount INTEGER,
          severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
          description TEXT,
          status TEXT DEFAULT 'active',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          resolvedAt DATETIME
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables initialized successfully');
          resolve();
        }
      });
    });
  });
};

export const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default db;