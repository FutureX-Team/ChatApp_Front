// src/pages/Settings.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";

export default function Settings({ user, onLogout }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    // TODO: نداء PATCH /me أو /users/:id (حسب الباك)
    alert("تم حفظ الإعدادات (مؤقت).");
  };

  const handleLogoutClick = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    } finally {
      setAuthToken(null);
      onLogout && onLogout();
      navigate("/login");
    }
  };

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
