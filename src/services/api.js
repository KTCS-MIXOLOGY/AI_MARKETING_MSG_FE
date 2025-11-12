import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그아웃 처리
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`users/${id}`, userData),
  deleteUser: (id) => api.delete(`users/${id}`),
};

// Campaigns API
export const campaignsAPI = {
  getCampaigns: (params = {}) => api.get('campaigns', { params }),
  getCampaign: (id) => api.get(`campaigns/${id}`),
  createCampaign: (campaignData) => api.post('campaigns', campaignData),
  updateCampaign: (id, campaignData) => api.put(`campaigns/${id}`, campaignData),
  deleteCampaign: (id) => api.delete(`campaigns/${id}`),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('products', { params }),
  getProduct: (id) => api.get(`products/${id}`),
  createProduct: (productData) => api.post('products', productData),
  updateProduct: (id, productData) => api.put(`products/${id}`, productData),
  deleteProduct: (id) => api.delete(`products/${id}`),
};

// Customers API
export const customersAPI = {
  getCustomers: (params = {}) => api.get('customers', { params }),
  getCustomer: (id) => api.get(`customers/${id}`),
  searchCustomers: (query) => api.get(`customers/search?q=${query}`),
  getCustomerSegments: (customerId) => api.get(`customers/${customerId}/segments`),
  getCustomerUsage: (customerId) => api.get(`customers/${customerId}/usage`),
};

// Segments API
export const segmentsAPI = {
  getSegments: (params = {}) => api.get('segments', { params }),
  getSegment: (id) => api.get(`segments/${id}`),
  createSegment: (segmentData) => api.post('segments', segmentData),
  updateSegment: (id, segmentData) => api.put(`segments/${id}`, segmentData),
  deleteSegment: (id) => api.delete(`segments/${id}`),
  getSegmentCustomers: (id) => api.get(`segments/${id}/customers`),
};

// Messages API
export const messagesAPI = {
  getMessages: (params = {}) => api.get('messages', { params }),
  getMessage: (id) => api.get(`messages/${id}`),
  createMessage: (messageData) => api.post('messages', messageData),
  updateMessage: (id, messageData) => api.put(`messages/${id}`, messageData),
  deleteMessage: (id) => api.delete(`messages/${id}`),
  generateMessage: (generationData) => api.post('messages/generate', generationData),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('analytics/dashboard'),
  getCampaignStats: (campaignId) => api.get(`analytics/campaigns/${campaignId}`),
  getCustomerStats: (customerId) => api.get(`analytics/customers/${customerId}`),
  getMessageStats: () => api.get('analytics/messages'),
};

// AI API
export const aiAPI = {
  generateMessage: (prompt, context) => api.post('ai/generate', { prompt, context }),
  analyzeSentiment: (text) => api.post('ai/analyze-sentiment', { text }),
  optimizeMessage: (message, target) => api.post('ai/optimize', { message, target }),
};

export default api;