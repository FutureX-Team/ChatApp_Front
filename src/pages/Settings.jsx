// src/pages/Settings.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ استقبال onLogout
export default function Settings({ user, setUser, onLogout, darkMode }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    // ✅ تحديث localStorage أيضًا عند تعديل البيانات
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert("تم حفظ التعديلات!");
  };

  const handleLogoutClick = () => {
    onLogout(); // ✅ استدعاء دالة تسجيل الخروج من App.js
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }
  
  // ... باقي الكود (جزء التصميم) لا يتغير ...
  const inputClass = "w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600";

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl mb-6 font-bold text-center text-black dark:text-white">إعدادات الحساب</h2>
        <form onSubmit={handleSave}>
          <label className="block mb-2 text-black dark:text-white">الاسم</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          <label className="block mb-2 text-black dark:text-white">البريد الإلكتروني</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600">
            حفظ التعديلات
          </button>
        </form>
        <button onClick={handleLogoutClick} className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600">
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
