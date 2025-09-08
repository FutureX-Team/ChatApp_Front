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
import AuthCallback from "./pages/AuthCallback";
import Support from "./pages/Support";

import api, { setAuthToken, rehydrateAuth } from "./api/api";

export default function App() {
  // --- START: تعديلات الوضع المظلم الشاملة ---

  // قراءة الوضع المحفوظ من localStorage عند بدء التشغيل
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // useEffect لتطبيق التغييرات على مستوى الـ HTML وحفظها
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- END: نهاية التعديلات ---

  const start = (() => {
    const { token, cachedUser } = rehydrateAuth();
    return {
      user: cachedUser,
      isAdmin: cachedUser?.role === "admin",
      hasToken: !!token,
    };
  })();

  const [user, setUser] = useState(start.user);
  const [isAdmin, setIsAdmin] = useState(start.isAdmin);
  const [tweets, setTweets] = useState([]);
  const [authLoading, setAuthLoading] = useState(start.hasToken);

  useEffect(() => {
    const boot = async () => {
      if (!start.hasToken) return setAuthLoading(false);
      try {
        const { data } = await api.get("/me");
        const me = data?.user ?? data;
        setUser(me);
        setIsAdmin(me?.role === "admin");
        localStorage.setItem("user", JSON.stringify(me));
      } catch (e) {
        setAuthToken(null);
        localStorage.removeItem("user");
        setUser(null);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    };
    boot();
  }, [start.hasToken]);

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch {}
    setAuthToken(null);
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
  };

  const insertReplyIntoTree = (list, parentId, reply) => {
    return list.map(t => {
      if (t.id === parentId) {
        return { ...t, replies: [...(t.replies || []), reply] };
      }
      if (Array.isArray(t.replies) && t.replies.length) {
        return { ...t, replies: insertReplyIntoTree(t.replies, parentId, reply) };
      }
      return t;
    });
  };

  const onAddReply = (parentId, reply) => {
    setTweets(prev => insertReplyIntoTree(prev, parentId, reply));
  };

  const Protected = ({ cond, to = "/login", children }) =>
    cond ? children : <Navigate to={to} replace />;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        جارِ التحقق من الجلسة...
      </div>
    );
  }

  return (
    // لم نعد بحاجة للكلاس هنا لأن التحكم يتم عبر <html>
    <div className="min-h-screen">
      <Router>
        <Navbar user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home user={user} tweets={tweets} setTweets={setTweets} />} />
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/auth/callback" element={<AuthCallback setUser={setUser} setIsAdmin={setIsAdmin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Protected cond={!!user}><Profile user={user} tweets={tweets} /></Protected>} />
            <Route
  path="/settings"
  element={<Protected cond={!!user}>
    <Settings user={user} onLogout={handleLogout} setUser={setUser} />
  </Protected>}
/>

            <Route path="/support" element={<Support />} />

            <Route path="/reports" element={
              <Protected cond={!!user && isAdmin} to="/">
                <AdminPage user={user} isAdmin={isAdmin} tweets={tweets} deleteTweet={() => {}} />
              </Protected>
            } />
            <Route
              path="/tweet/:id"
              element={<TweetDetail user={user} tweets={tweets} deleteTweet={() => {}} isAdmin={isAdmin} onAddReply={onAddReply} />}
            />
            <Route path="*" element={<div className="text-center py-10"><h2>404 - الصفحة غير موجودة</h2></div>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
