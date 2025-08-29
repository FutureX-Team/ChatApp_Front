// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/api';
 // ✅ استيراد api

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post('/login', { email, password });
      onLogin(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      setError("فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleLoginSubmit}>
        <h2 className="text-2xl mb-4 text-center font-bold text-black dark:text-white">تسجيل الدخول</h2>
        {error && <p className="bg-red-500 text-white p-2 rounded mb-4">{error}</p>}
        {/* ... حقول الإدخال ... */}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">تسجيل الدخول</button>
      </form>
    </div>
  );
}
