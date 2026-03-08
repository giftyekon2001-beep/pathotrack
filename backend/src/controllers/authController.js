import { hashPassword, comparePassword } from '../utils/encryption.js';
import { generateToken } from '../utils/jwt.js';
import { getQuery, runQuery } from '../database.js';

export const register = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, role = 'community', location } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await getQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const result = await runQuery(
      `INSERT INTO users (email, phone, password, firstName, lastName, role, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, phone || null, hashedPassword, firstName, lastName, role, location || null]
    );

    const token = generateToken(result.lastID, role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.lastID,
        email,
        firstName,
        lastName,
        role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getQuery('SELECT id, email, firstName, lastName, role, location FROM users WHERE id = ?', [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, location, latitude, longitude } = req.body;
    
    await runQuery(
      `UPDATE users SET firstName = COALESCE(?, firstName), 
       lastName = COALESCE(?, lastName),
       location = COALESCE(?, location),
       latitude = COALESCE(?, latitude),
       longitude = COALESCE(?, longitude),
       updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [firstName || null, lastName || null, location || null, latitude || null, longitude || null, req.user.userId]
    );

    const user = await getQuery('SELECT id, email, firstName, lastName, role, location FROM users WHERE id = ?', [req.user.userId]);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};