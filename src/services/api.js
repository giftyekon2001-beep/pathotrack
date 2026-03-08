import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const symptomAPI = {
  checkSymptoms: (symptoms) => api.post('/symptoms/check', { symptoms }),
  reportSymptoms: (data) => api.post('/symptoms/report', data),
  getMyReports: () => api.get('/symptoms/my-reports'),
  getCommunityReports: () => api.get('/symptoms/community-reports'),
};

export const labAPI = {
  registerLaboratory: (data) => api.post('/laboratories/register', data),
  uploadResult: (data) => api.post('/laboratories/results', data),
  getResults: () => api.get('/laboratories/results'),
  getAllLabs: () => api.get('/laboratories/all'),
  getNearbyLabs: (latitude, longitude, radiusKm = 10) =>
    api.get('/laboratories/nearby', { params: { latitude, longitude, radiusKm } }),
};

export const outbreakAPI = {
  detectOutbreaks: () => api.get('/outbreaks/detect'),
  getAlerts: () => api.get('/outbreaks/alerts'),
  getTrends: (days = 30, location = '') =>
    api.get('/outbreaks/trends', { params: { days, location } }),
};

export const educationAPI = {
  getContent: () => api.get('/education/content'),
  getByCategory: (category) => api.get(`/education/content/${category}`),
};

export default api;