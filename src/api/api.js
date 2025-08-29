// src/api.js
import axios from 'axios';

// ✅ !! مهم جدًا: عدّل هذا الرابط إلى رابط الخادم الحقيقي الخاص بك !!
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // مثال لخادم محلي
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} );

// دالة لضبط التوكن في الهيدر
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// معالج الأخطاء التلقائي (Interceptor)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setAuthToken(null);
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
