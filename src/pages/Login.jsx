import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { setAuthToken, setUserCache } from "../api/api";

export default function Login({ setUser, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const translateServerMessage = (msg) => {
    const map = {
      "This email is already registered": "هذا البريد الإلكتروني مسجّل مسبقًا",
      "This email is not registered": "هذا البريد الإلكتروني غير مسجّل",
      "Invalid credentials": "بيانات تسجيل الدخول غير صحيحة",
      "User not found": "المستخدم غير موجود",
      "Password must be at least 8 characters": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      "Email is required": "البريد الإلكتروني مطلوب",
      "Password is required": "كلمة المرور مطلوبة",
    };
    return map[msg] || msg;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("البريد الإلكتروني مطلوب!");
    if (!password) return toast.error("كلمة المرور مطلوبة!");

    try {
      setLoading(true);
      const { data } = await api.post("/login", { email, password });
      const { user, token } = data;

      // 🔑 حفظ التوكن واليوزر
      setAuthToken(token);
      setUserCache(user);

      setUser(user);
      setIsAdmin(user?.role === "admin");

      toast.success("تم تسجيل الدخول بنجاح ✅");
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.data || err.message);

      if (err.response?.data?.message) {
        toast.error(translateServerMessage(err.response.data.message));
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((msg) => `⚠ ${translateServerMessage(msg)}`)
          .join(" | ");
        toast.error(`الحقول غير صحيحة: ${errorMessages}`);
      } else {
        toast.error("فشل تسجيل الدخول. تأكد من البيانات.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBase = process.env.REACT_APP_API_BASE_URL;
    if (!apiBase) return toast.error("الرابط غير مضبوط. تحقق من ملف .env");

    const googleAuthWindow = window.open(
      `${apiBase}/auth/google`,
      "_blank",
      "width=500,height=600"
    );
    if (!googleAuthWindow)
      toast.error("لا يمكن فتح نافذة تسجيل Google. تحقق من المتصفح.");
  };

  return (
    <div className="flex justify-center items-center pt-10 sm:pt-16">
      <form
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm"
        onSubmit={handleLoginSubmit}
      >
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">
          تسجيل الدخول
        </h2>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
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
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
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

        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>

        <div className="text-center my-3 text-sm text-gray-600 dark:text-gray-400">
          أو
        </div>

        {/* تسجيل Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
        >
          متابعة باستخدام Google
        </button>

        {/* رابط التسجيل */}
        <div className="text-center mt-6 text-sm space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟
            <Link
              to="/register"
              className="font-semibold text-blue-500 hover:underline mr-1"
            >
              سجل الآن
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
