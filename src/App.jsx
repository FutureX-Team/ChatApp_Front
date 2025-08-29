// src/App.jsx

// ✅ 1. هذا هو الجزء الأهم الذي كان ناقصًا
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// استيراد المكونات والصفحات
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import TweetDetail from "./pages/TweetDetail";

function App() {
  // ✅ 2. تعريف الحالات (useState)
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tweets, setTweets] = useState([
    { id: 1, user: { name: "أحمد" }, text: "هذه تغريدة تجريبية أولى! 🚀", up_count: 15, down_count: 1, replies: [
        { id: 101, user: { name: "فاطمة" }, text: "رد تجريبي!", up_count: 2, down_count: 0, replies: [] }
    ]},
    { id: 2, user: { name: "سارة" }, text: "مرحباً بالعالم! تصميم جميل.", up_count: 42, down_count: 0, replies: [] },
  ]);

  // ✅ 3. تعريف دالة تسجيل الخروج
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      {/* ✅ 4. استخدام المكونات التي تم استيرادها */}
      <Router>
        <Navbar user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home user={user} tweets={tweets} setTweets={setTweets} />} />
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile user={user} tweets={tweets} />} />
            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
            <Route path="/reports" element={<Reports user={user} isAdmin={isAdmin} />} />
            <Route path="/tweet/:id" element={<TweetDetail user={user} tweets={tweets} />} />
            <Route path="*" element={<div className="text-center py-10"><h2>404 - الصفحة غير موجودة</h2></div>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
