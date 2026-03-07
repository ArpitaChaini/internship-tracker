import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');

// Applications
export const createApplication = (data) => api.post('/applications', data);
export const getApplications = (params) => api.get('/applications', { params });
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
export const getDashboardStats = () => api.get('/applications/stats');

// Interview Notes
export const createNote = (data) => api.post('/notes', data);
export const getNotes = () => api.get('/notes');
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Resumes
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getResumes = () => api.get('/resume');
export const downloadResume = (id) =>
  api.get(`/resume/download/${id}`, { responseType: 'blob' });
export const deleteResume = (id) => api.delete(`/resume/${id}`);

export default api;
