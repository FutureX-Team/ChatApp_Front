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
      <form onSubmit={handleRegisterSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">إنشاء حساب جديد</h2>

        <input type="text" placeholder="اسم المستخدم" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />

        <button type="submit" disabled={loading} className="btn-primary">{loading ? "جاري الإنشاء..." : "إنشاء الحساب"}</button>
        <button type="button" onClick={handleGoogleLogin} className="btn-outline mt-2">متابعة باستخدام Google</button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          لديك حساب؟ <Link to="/login" className="text-blue-500 hover:underline">سجل الدخول</Link>
        </p>
      </form>
    </div>
  );
}
