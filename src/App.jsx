// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPage from "./pages/AdminPage";
import TweetDetail from "./pages/TweetDetail";

import api, { setAuthToken } from "./api/api";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [loadingTweets, setLoadingTweets] = useState(true);

  // ✅ استرجاع التوكن (إن وجد) + (اختياري) جلب المستخدم الحالي
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    // لو عندك /api/me رجّع بيانات المستخدم
    // (async () => {
    //   try {
    //     const { data } = await api.get("/me");
    //     setUser(data.user);
    //     setIsAdmin(data.user?.role === "admin");
    //   } catch {}
    // })();
  }, []);

  // ✅ جلب التايملاين مرة وحدة هنا (تقدر تشيل الفetch من Home لو تحب)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTweets(true);
        const res = await api.get("/tweets");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (mounted) setTweets(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoadingTweets(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    } finally {
      setAuthToken(null);
      setUser(null);
      setIsAdmin(false);
    }
  };

  // ✅ حذف تغريدة من السيرفر ثم من الحالة
  const deleteTweet = async (tweetId) => {
    try {
      await api.delete(`/tweets/${tweetId}`);
      setTweets((cur) => cur.filter((t) => t.id !== tweetId));
      alert(`تم حذف التغريدة رقم ${tweetId}`);
    } catch (e) {
      console.error(e);
      alert("فشل حذف التغريدة.");
    }
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      <Router>
        <Navbar
          user={user}
          isAdmin={isAdmin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
        />
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  tweets={tweets}
                  setTweets={setTweets}
                  loading={loadingTweets} // (اختياري) لو بتستخدمه في Home
                />
              }
            />
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile user={user} tweets={tweets} />} />
            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />

            {/* ✅ حماية صفحة الأدمن */}
            <Route
              path="/reports"
              element={
                user && isAdmin
                  ? <AdminPage user={user} isAdmin={isAdmin} tweets={tweets} deleteTweet={deleteTweet} />
                  : <Navigate to="/" replace />
              }
            />

            {/* ✅ تمرير deleteTweet لتفاصيل التغريدة */}
            <Route
              path="/tweet/:id"
              element={<TweetDetail user={user} tweets={tweets} deleteTweet={deleteTweet} isAdmin={isAdmin} />}
            />

            <Route path="*" element={<div className="text-center py-10"><h2>404 - الصفحة غير موجودة</h2></div>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
