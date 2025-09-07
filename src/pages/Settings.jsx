// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { rehydrateAuth, setAuthToken } from "../api/api";

export default function Settings({ onLogout }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("1. [Settings] Starting to fetch user data...");

      // --- التشخيص الأول: قراءة الذاكرة المؤقتة ---
      const { cachedUser, token } = rehydrateAuth();
      console.log("2. [Settings] Reading from localStorage:", { cachedUser, token });

      if (cachedUser && typeof cachedUser === 'object') {
        console.log("3. [Settings] Found user in cache. Applying data.", cachedUser);
        setName(cachedUser.name || "");
        setEmail(cachedUser.email || "");
        setLoading(false);
        return; // نكتفي بالبيانات من الذاكرة المؤقتة
      }

      // --- التشخيص الثاني: إذا لم تنجح القراءة من الذاكرة، نلجأ للخادم ---
      console.log("4. [Settings] No user in cache. Fetching from /me endpoint...");
      try {
        const { data } = await api.get("/me");
        const currentUser = data?.user ?? data; // التعامل مع أشكال مختلفة للرد
        console.log("5. [Settings] Successfully fetched data from API:", currentUser);

        if (currentUser && typeof currentUser === 'object') {
          setName(currentUser.name || "");
          setEmail(currentUser.email || "");
        } else {
          console.error("6. [Settings] API response is not a valid user object.");
        }
      } catch (error) {
        console.error("7. [Settings] CRITICAL: Failed to fetch user from API.", error.response?.data || error.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSave = (e) => { e.preventDefault(); alert("ميزة الحفظ قيد التطوير."); };

  const handleLogoutClick = async () => {
    try { await api.post("/logout"); } catch (e) { console.error(e); }
    finally {
      setAuthToken(null);
      localStorage.removeItem("user");
      if (onLogout) onLogout();
      navigate("/login");
    }
  };

  if (loading) {
    return <div className="text-center p-10">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-gray-800 dark:text-white">إعدادات الحساب</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">الاسم</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">حفظ التعديلات</button>
          <button type="button" onClick={handleLogoutClick} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">تسجيل الخروج</button>
        </div>
      </form>
    </div>
  );
}
