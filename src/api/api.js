// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false, // نعتمد Bearer فقط
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

export const rehydrateAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  try {
    const cachedUser = localStorage.getItem("user");
    return { token, cachedUser: cachedUser ? JSON.parse(cachedUser) : null };
  } catch {
    return { token, cachedUser: null };
  }
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
