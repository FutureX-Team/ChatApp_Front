// src/App.js
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api, { setAuthToken } from './api/api';
 // ✅ استيراد api

// ... استيراد باقي المكونات ...
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import TweetDetail from "./pages/TweetDetail";
// ...

function App() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ حالة للتحميل الأولي
  const [darkMode, setDarkMode] = useState(false);

  // ✅ التحقق من التوكن وجلب بيانات المستخدم عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      api.get('/me')
        .then(response => {
          setUser(response.data.user);
          setDarkMode(response.data.user.dark_mode);
        })
        .catch(() => {
          // إذا كان التوكن غير صالح
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ دالة تسجيل الدخول الجديدة
  const handleLogin = (userData, token) => {
    setAuthToken(token);
    setUser(userData);
    setDarkMode(userData.dark_mode);
  };

  // ✅ دالة تسجيل الخروج الجديدة
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  // إذا كان التطبيق لا يزال يتحقق من التوكن، أظهر شاشة تحميل
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading...</div>;
  }

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <Router>
        <Navbar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto p-2 sm:p-4">
          <Routes>
            <Route path="/" element={<Home user={user} tweets={tweets} setTweets={setTweets} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* ... باقي الصفحات مع تمرير الخصائص الجديدة ... */}
            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} setUser={setUser} />} />
            <Route path="/tweet/:id" element={<TweetDetail user={user} />} />
            {/* ... */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
