// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";

export default function Login({ setUser, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/login", { email, password });
      const { user, token } = data;

      setAuthToken(token);              // Bearer أو كوكيز حسب إعدادك
      setUser(user);
      setIsAdmin(user?.role === "admin");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("فشل تسجيل الدخول. تأكد من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 sm:pt-16">
      <form className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm" onSubmit={handleLoginSubmit}>
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">تسجيل الدخول</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>

        <div className="text-center mt-6 text-sm space-y-2">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">نسيت كلمة المرور؟</Link>
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟
            <Link to="/register" className="font-semibold text-blue-500 hover:underline mr-1">سجل الآن</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
