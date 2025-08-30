// src/pages/Settings.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 1. استقبال onLogout كـ prop
export default function Settings({ user, onLogout }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const navigate = useNavigate();

  if (!user) {
    // إعادة التوجيه إذا لم يكن المستخدم مسجلاً
    navigate('/login');
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    alert("تم حفظ الإعدادات (وهمي)!");
  };

  // ✅ 2. استدعاء onLogout عند الضغط على الزر
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      navigate('/login'); // توجيه المستخدم لصفحة الدخول بعد الخروج
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-gray-800 dark:text-white">
          إعدادات الحساب
        </h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">الاسم</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            حفظ التعديلات
          </button>
          {/* ✅ 3. ربط الزر بالدالة الصحيحة */}
          <button type="button" onClick={handleLogoutClick} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            تسجيل الخروج
          </button>
        </div>
      </form>
    </div>
  );
}
