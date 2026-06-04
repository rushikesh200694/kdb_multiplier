import axios from 'axios';

// Automatically use relative path '/api' in production if VITE_API_URL is not set, 
// otherwise fallback to localhost for development.
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const visitAPI = {
  getAll: () => api.get('/visits'),
  getById: (id) => api.get(`/visits/${id}`),
  create: (data) => api.post('/visits', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/visits/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/visits/${id}`),
  addGallery: (id, data) => api.post(`/visits/${id}/gallery`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeGallery: (id, imgId) => api.delete(`/visits/${id}/gallery/${imgId}`),
};

export const reviewAPI = {
  getAll: (admin = false) => api.get(`/reviews${admin ? '?admin=true' : ''}`),
  create: (data) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getMyOrders: () => api.get('/orders/my-orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  loginCustomer: (data) => api.post('/auth/customer/login', data),
  getMe: () => api.get('/auth/me'),
};

export const bannerAPI = {
  getActive: () => api.get('/banners'),
  getAll: () => api.get('/banners/admin'),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
};

export default api;
