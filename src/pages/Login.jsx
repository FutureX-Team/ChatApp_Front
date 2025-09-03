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
    setLoading(true);
    try {
      const { data } = await api.post("/login", {
        email: email,
        password,
      });
      const { user, token } = data;

      setAuthToken(token);
      setUser(user);
      setIsAdmin(user?.role === "admin");
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.status, err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
          (err?.response?.data?.errors && JSON.stringify(err.response.data.errors)) ||
          "فشل تسجيل الدخول. تأكد من البيانات."
      );
    } finally {
      setLoading(false);
    }
  };

  
const handleGoogleLogin = () => {
  const apiBase = process.env.REACT_APP_API_BASE_URL; 
  window.location.href = `${apiBase}/auth/google`;
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

        {/* NEW: tiny divider + Google button (neutral style; no color scheme changes) */}
        <div className="text-center my-3 text-sm text-gray-600 dark:text-gray-400">أو</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
        >
          {/* simple G icon (inline svg) */}
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.1 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 5.1 29.3 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.5-7.6 21-18v-6.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.3 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 5.1 29.3 3 24 3 16 3 9.1 7.5 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.9 13.5-5.1l-6.2-5c-2.1 1.4-4.8 2.2-7.3 2.2-5.3 0-9.7-2.9-11.9-7.2l-6.6 5C7.7 39.9 15.3 45 24 45z"/>
            <path fill="#1976D2" d="M45 24c0-1.4-.1-2.4-.4-3.5H24v8h11.3c-.6 3-2.2 5.5-4.6 7.1l6.2 5C40.8 38.9 45 32.2 45 24z"/>
          </svg>
          متابعة باستخدام Google
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
