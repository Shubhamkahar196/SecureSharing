import axios from 'axios';

const API_BASE_URL = 'https://securesharing-backend.onrender.com/api';
console.log('API Base URL configured:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// File API
export const fileAPI = {
  upload: (formData) => api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getUserFiles: () => api.get('/files/my-files'),
  deleteFile: (id) => api.delete(`/files/${id}`),
};

// View API
export const viewAPI = {
  getFileInfo: (shareLink) => api.get(`/view/${shareLink}`),
  accessFile: (shareLink, password = '') => api.post(`/view/${shareLink}/access`, { password }, {
    responseType: 'blob',
  }),
};

export default api;
