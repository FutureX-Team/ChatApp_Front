import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function Navbar({ user, isAdmin, darkMode, setDarkMode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-800">
      <div>
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </Link>
      </div>
      <div className="flex items-center gap-4 relative">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* صورة الحساب أو تسجيل دخول */}
<div className="relative"> {/* مهم: relative */}
  {user ? (
    <img
      src={user.avatar}
      alt="avatar"
      className="h-10 w-10 rounded-full cursor-pointer"
      onClick={() => setDropdownOpen(prev => !prev)}
    />
  ) : (
    <Link to="/login">
      <img src="/avatar-login.png" alt="Login" className="h-10 w-10 rounded-full cursor-pointer" />
    </Link>
  )}

  {user && dropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md z-50">
      <Link
        to="/profile"
        className="block px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        الملف التعريفي
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        الإعدادات
      </Link>
    </div>
  )}
</div>




        {isAdmin && <Link to="/reports" className="px-4 py-2 bg-red-500 text-white rounded">البلاغات</Link>}
      </div>
    </nav>
  );
}
