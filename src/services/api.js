import axios from 'axios';

// Backend API Base URL (환경 변수에서 읽음)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 70000,
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
    // Backend 응답 구조 확인 (success 필드가 있을 경우)
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'API 요청 실패'));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그아웃 처리
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Backend 에러 메시지 추출
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);

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

// Profile API (관리자, 실행자 모두 사용 가능)
export const profileAPI = {
  getMyProfile: () => api.get('/users/me'),
  updateMyProfile: (profileData) => api.patch('/users/me', profileData),
  changePassword: (passwordData) => api.patch('/users/me/password', passwordData),
};

// Users API (Admin only)
export const usersAPI = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  approveUser: (id, role) => api.patch(`/admin/users/${id}/approve`, { role }),
  rejectUser: (id, role) => api.patch(`/admin/users/${id}/reject`, { role }),
};

// Campaigns API
export const campaignsAPI = {
  // 조회 (ADMIN, EXECUTOR 모두 가능)
  getCampaigns: (params = {}) => api.get('/campaigns', { params }),
  getCampaign: (id) => api.get(`/campaigns/${id}`),

  // 생성/수정/삭제 (ADMIN only)
  createCampaign: (campaignData) => api.post('/admin/campaigns', campaignData),
  updateCampaign: (id, campaignData) => api.put(`/admin/campaigns/${id}`, campaignData),
  deleteCampaign: (id) => api.delete(`/admin/campaigns/${id}`),
};

// Products API
export const productsAPI = {
  // 조회 (ADMIN, EXECUTOR 모두 가능)
  getProducts: (params = {}) => api.get('/products', { params }),
  searchProducts: (name, params = {}) => api.get('/products/search', { params: { name, ...params } }),
  getProduct: (id) => api.get(`/products/${id}`),

  // 생성/수정/삭제 (ADMIN only)
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

// Customers API (EXECUTOR)
export const customersAPI = {
  // searchType: ID, PHONE, NAME
  searchCustomers: (searchType, searchValue) =>
    api.get('/executor/customers/search', {
      params: { searchType, searchValue }
    }),
  getCustomer: (id) => api.get(`/executor/customers/${id}`),

  // 아래 API들은 Backend에 미구현 - 추후 개발 필요
  // getCustomerSegments: (customerId) => api.get(`/executor/customers/${customerId}/segments`),
  // getCustomerUsage: (customerId) => api.get(`/executor/customers/${customerId}/usage`),
};

// Segments API (Admin & EXECUTOR)
export const segmentsAPI = {
  // Admin API
  getSegments: (params = {}) => api.get('/admin/customer-segments', { params }),
  getSegment: (id) => api.get(`/admin/customer-segments/${id}`),

  // Executor API (추후 사용)
  // getExecutorSegments: (params = {}) => api.get('/executor/segments', { params }),
  // getExecutorSegment: (id) => api.get(`/executor/segments/${id}`),

  // 고객 세그먼트 필터링 기반 고객 수 계산
  getSegmentCustomerCount: (filters) => api.post('/executor/segments/count', filters),

  // 아래 API들은 Backend에 미구현 - 추후 개발 필요
  // createSegment: (segmentData) => api.post('/admin/customer-segments', segmentData),
  // updateSegment: (id, segmentData) => api.put(`/admin/customer-segments/${id}`, segmentData),
  // deleteSegment: (id) => api.delete(`/admin/customer-segments/${id}`),
  // getSegmentCustomers: (id) => api.get(`/admin/customer-segments/${id}/customers`),
};

// Messages API (EXECUTOR)
export const messagesAPI = {
  // 메시지 생성 (개별 고객 또는 세그먼트 대상)
  createMessage: (messageData) => api.post('/executor/messages', messageData),

  // 개별 고객 메시지 생성
  generateIndividualMessage: (messageData) =>
    api.post('/executor/messages/generate/individual', messageData),

  // 세그먼트 대상 메시지 생성
  generateSegmentMessage: (messageData) =>
    api.post('/executor/messages/generate/segment', messageData),

  // 메시지 저장
  saveMessage: (saveData) => api.post('/executor/messages/save', saveData),

  // 아래 API들은 Backend에 미구현 - 추후 개발 필요
  // getMessages: (params = {}) => api.get('/executor/messages', { params }),
  // getMessage: (id) => api.get(`/executor/messages/${id}`),
  // updateMessage: (id, messageData) => api.put(`/executor/messages/${id}`, messageData),
  // deleteMessage: (id) => api.delete(`/executor/messages/${id}`),
};

// Analytics API (미구현 - 추후 개발 필요)
export const analyticsAPI = {
  // getDashboardStats: () => api.get('/analytics/dashboard'),
  // getCampaignStats: (campaignId) => api.get(`/analytics/campaigns/${campaignId}`),
  // getCustomerStats: (customerId) => api.get(`/analytics/customers/${customerId}`),
  // getMessageStats: () => api.get('/analytics/messages'),
};

// Tone & Manner API (EXECUTOR)
export const toneMannerAPI = {
  getToneManners: () => api.post('/executor/tone-manner'),
};

// AI API (미구현 - AI 통합 후 개발 필요)
export const aiAPI = {
  // generateMessage: (prompt, context) => api.post('/ai/generate', { prompt, context }),
  // analyzeSentiment: (text) => api.post('/ai/analyze-sentiment', { text }),
  // optimizeMessage: (message, target) => api.post('/ai/optimize', { message, target }),
};

// Helper function: Backend 페이징 응답 데이터 추출
export const extractPageData = (response) => {
  // Backend 응답 구조: { success, data: { content, page, size, totalElements, totalPages }, ... }
  if (response?.data?.data) {
    return response.data.data;
  }
  // 단일 객체 응답
  if (response?.data) {
    return response.data;
  }
  return null;
};

export default api;
