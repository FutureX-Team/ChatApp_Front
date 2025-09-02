import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";

export default function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ إضافة حالة لعرض الأخطاء بشكل أفضل
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(""); // إعادة تعيين الخطأ عند كل محاولة
    setLoading(true);

    try {
      // ✅ ---  الحل هنا --- ✅
      // تم تغيير "username" إلى "name" ليتوافق مع الخادم
      const { data } = await api.post("/register", {username: name, email, password });
      
      const { user, token } = data;

      setAuthToken(token);
      setUser(user);
      navigate("/"); // الانتقال للصفحة الرئيسية بعد النجاح
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      // ✅ تحسين طريقة عرض الخطأ للمستخدم
      const errorMessage = err.response?.data?.message || "فشل إنشاء الحساب. تأكد من أن البريد الإلكتروني غير مستخدم.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10 sm:pt-16">
      <form className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm" onSubmit={handleRegisterSubmit}>
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">إنشاء حساب جديد</h2>

        {/* ✅ عرض رسالة الخطأ بشكل واضح */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">الاسم</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟
            <Link to="/login" className="font-semibold text-blue-500 hover:underline mr-1">سجل الدخول</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
