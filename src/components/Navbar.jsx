// src/components/Navbar.jsx

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Sun, Moon, LogIn  } from "lucide-react";

import Avatar from "./Avatar";

export default function Navbar({ user, isAdmin, darkMode, setDarkMode, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-3">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Home className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </Link>

        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAdmin && (
            <Link to="/reports" className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600">
              لوحة التحكم
            </Link>
          )}

          <div className="flex items-center gap-4 " ref={dropdownRef}>
            {user ? (
              <div className="cursor-pointer" onClick={() => setDropdownOpen(prev => !prev)}>
                <Avatar name={user.username || user.name} url={user.avatar_url} />
              </div>
            ) : (
              <Link 
                to="/login" 
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 "
                title="تسجيل الدخول" // إضافة تلميح للمستخدم عند المرور على الأيقونة
              >
                <LogIn className=" text-gray-700 dark:text-gray-200" />
              </Link>
            )}

            {user && dropdownOpen && (
              // ✅ --- التعديل هنا --- ✅
              <div 
                className="absolute left-0 mt-2 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-50 overflow-hidden"
                // ✅ 1. تحديد عرض ثابت للقائمة
                // ✅ 2. تحريك القائمة لليسار لتوسيطها تحت الأيقونة
                style={{ width: '12rem', transform: 'translate(10px, 86px)' }} 
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                  <p className="font-bold text-sm text-right">{user.username}</p>
                </div>
                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-right text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                  الملف الشخصي
                </Link>
                <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-right text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                  الإعدادات
                </Link>
                <Link to="/Support" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-right text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                  الدعم
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-600">
                  <button onClick={handleLogoutClick} className="w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
