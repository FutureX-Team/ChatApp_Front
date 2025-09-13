// src/api.js
import axios from "axios";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false, // Bearer only

});


export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const setUserCache = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const rehydrateAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  try {
    const cachedUser = localStorage.getItem(USER_KEY);
    return { token, cachedUser: cachedUser ? JSON.parse(cachedUser) : null };
  } catch {
    return { token, cachedUser: null };
  }
};

// --- Interceptors ---
api.interceptors.response.use(
  (res) => {
    // normalize response payload
    const d = res.data;
    res.data = Array.isArray(d) ? d : (d?.data ?? d);
    return res;
  },
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
        setUserCache(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// auto-rehydrate once on load
rehydrateAuth();

export default api;
