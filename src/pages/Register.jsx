import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { setAuthToken } from "../api/api";
import { showErrorToast } from "../utils/toast";

export default function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("جميع الحقول مطلوبة!");
    if (password.length < 8) return toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");

    try {
      setLoading(true);
      const { data } = await api.post("/register", { username: name, email, password });
      const { user, token } = data;

      setAuthToken(token);
      setUser(user);
      toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح ✅");
      navigate("/");
    } catch (err) {
      showErrorToast(err);
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
      <form
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm"
        onSubmit={handleRegisterSubmit}
      >
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">
          إنشاء حساب جديد
        </h2>

        {/* اسم المستخدم */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            اسم المستخدم
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسم المستخدم"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* كلمة المرور */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* زر التسجيل */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>

        {/* خيار تسجيل عبر Google */}
        <div className="text-center my-3 text-sm text-gray-600 dark:text-gray-400">أو</div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
        >
          متابعة باستخدام Google
        </button>

        {/* رابط تسجيل الدخول */}
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟
            <Link to="/login" className="font-semibold text-blue-500 hover:underline mr-1">
              سجل الدخول
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}