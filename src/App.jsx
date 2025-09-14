import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import Profileusr from "./pages/Profileusr";
import { Toaster } from "react-hot-toast";

import api, { setAuthToken, rehydrateAuth, setUserCache } from "./api/api";

/* ---------- Global OAuth listener (handles popup postMessage) ---------- */
function OAuthListener({ setUser, setIsAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function onMessage(ev) {
      // Must match exactly (scheme + host + port)
      if (ev.origin !== window.location.origin) return;
      if (ev.data?.type !== "OAUTH_SUCCESS") return;

      const { token } = ev.data.payload || {};
      if (!token) return;

      setAuthToken(token);
      try {
        const { data: me } = await api.get("/me");
        setUser(me);
        setIsAdmin(me?.role === "admin");
        setUserCache(me);
        localStorage.setItem("user", JSON.stringify(me));
        navigate("/", { replace: true });
      } catch {
        setAuthToken(null);
        navigate("/login?error=session", { replace: true });
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate, setUser, setIsAdmin]);

  return null;
}
/* ---------------------------------------------------------------------- */

export default function App() {
  // 🌙 الوضع المظلم
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // 🛡️ تحميل المستخدم المحفوظ
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
  const [currentUser, setCurrentUser] = useState(null);

  // 🔑 Issue a guest token if none exists
  useEffect(() => {
    const { token } = rehydrateAuth();
    if (!token) {
      api
        .post("guest/ensure")
        .then(({ data }) => {
          setAuthToken(data.token); // Authorization: Bearer ...
          setUserCache(data.guest); // { id, nickname }
        })
        .catch(() => {
          // optional: toast error
        })
        .finally(() => setAuthLoading(false));
    }
  }, []);

  // تفعيل/تعطيل الوضع المظلم
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 👤 إذا عندنا توكن، جيب /me لتأكيد الجلسة
  useEffect(() => {
    const boot = async () => {
      if (!start.hasToken) return setAuthLoading(false);
      try {
        const { data } = await api.get("/me");
        const me = data?.user ?? data;
        setUser(me);
        setIsAdmin(me?.role === "admin");
        setUserCache(me); // ✅ نخزن بيانات المستخدم مع التوكن
      } catch (e) {
        setAuthToken(null);
        setUserCache(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start.hasToken]);

  // 🚪 تسجيل الخروج
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    setAuthToken(null);
    setUserCache(null);
    setUser(null);
    setIsAdmin(false);
  };

  // 💬 إدراج رد داخل الشجرة
  const insertReplyIntoTree = (list, parentId, reply) => {
    return list.map((t) => {
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
    setTweets((prev) => insertReplyIntoTree(prev, parentId, reply));
  };

  // 🛡️ حماية الصفحات
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
    <div className="min-h-screen">
      <Router>
        <Navbar
          user={user}
          isAdmin={isAdmin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
        />

        {/* 👇 Mounted globally so it can receive the popup message */}
        <OAuthListener setUser={setUser} setIsAdmin={setIsAdmin} />

        <main className="container mx-auto p-4">
          <Toaster position="top-center" reverseOrder={false} />

          <Routes>
            <Route
              path="/"
              element={<Home user={user} tweets={tweets} setTweets={setTweets} />}
            />

            <Route
              path="/login"
              element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />}
            />

            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* Popup & same-tab callback */}
            <Route
              path="/auth/callback"
              element={<AuthCallback setUser={setUser} setIsAdmin={setIsAdmin} />}
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/profile"
              element={
                <Protected cond={!!user}>
                  <Profile user={user} tweets={tweets} />
                </Protected>
              }
            />

            <Route
              path="/settings"
              element={
                <Protected cond={!!user}>
                  <Settings user={user} onLogout={handleLogout} setUser={setUser} />
                </Protected>
              }
            />

            <Route path="/support" element={<Support />} />

            <Route
              path="/reports"
              element={
                <Protected cond={!!user && isAdmin} to="/">
                  <AdminPage
                    user={user}
                    isAdmin={isAdmin}
                    tweets={tweets}
                    deleteTweet={() => {}}
                  />
                </Protected>
              }
            />

            <Route
              path="/tweet/:id"
              element={
                <TweetDetail
                  user={user}
                  tweets={tweets}
                  deleteTweet={() => {}}
                  isAdmin={isAdmin}
                  onAddReply={onAddReply}
                />
              }
            />

            <Route
              path="/profileusr/:username"
              element={<Profileusr currentUser={currentUser} />}
            />

            <Route
              path="*"
              element={
                <div className="text-center py-10">
                  <h2>404 - الصفحة غير موجودة</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
