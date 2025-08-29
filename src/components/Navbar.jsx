// src/components/Navbar.js
import { Link } from "react-router-dom";
// ... استيرادات ...

export default function Navbar({ user, darkMode, setDarkMode }) {
  // ...
  return (
    <nav className="flex items-center justify-between p-2 sm:p-4 shadow-md bg-white dark:bg-gray-800 sticky top-0 z-50">
      {/* ... */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* ... */}
        {/* إخفاء نص البلاغات على الشاشات الصغيرة جدًا */}
        {user?.role === 'admin' && (
          <Link to="/reports" className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">
            <span className="hidden sm:inline">البلاغات</span>
            <span className="sm:hidden">بلاغات</span>
          </Link>
        )}
        {/* ... */}
      </div>
    </nav>
  );
}
