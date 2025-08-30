// src/App.jsx

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ... (بقية استيراداتك)
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPage from "./pages/AdminPage"; 
import TweetDetail from "./pages/TweetDetail";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tweets, setTweets] = useState([
    { id: 1, user: { name: "أحمد" }, text: "هذه تغريدة تجريبية أولى! 🚀", up_count: 15, down_count: 1, replies: [] },
    { id: 2, user: { name: "سارة" }, text: "مرحباً بالعالم! تصميم جميل.", up_count: 42, down_count: 0, replies: [] },
    { id: 3, user: { name: "خالد" }, text: "تغريدة ثالثة لأغراض الاختبار.", up_count: 5, down_count: 2, replies: [] },
  ]);

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  // ✅ --- إضافة جديدة: دالة لحذف تغريدة ---
  const deleteTweet = (tweetId) => {
    setTweets(currentTweets => currentTweets.filter(tweet => tweet.id !== tweetId));
    // ملاحظة: هذا لا يحذف الردود التي قد تكون مرتبطة بالتغريدة المحذوفة.
    // في تطبيق حقيقي، ستحتاج إلى منطق أكثر تعقيدًا.
    alert(`تم حذف التغريدة رقم ${tweetId}`);
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      <Router>
        <Navbar user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
        <main className="container mx-auto p-4">
        
          <Routes>
            {/* ... (المسارات الأخرى) ... */}
            <Route path="/" element={<Home user={user} tweets={tweets} setTweets={setTweets} />} />
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* ✅ --- التصحيح هنا: تمرير setTweets و tweets إلى Profile --- ✅ */}
            <Route 
              path="/profile" 
              element={<Profile user={user} tweets={tweets} setTweets={setTweets} />} 
            />

            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
            <Route 
              path="/reports" 
              element={<AdminPage user={user} isAdmin={isAdmin} deleteTweet={deleteTweet} />} 
            />
            <Route 
              path="/tweet/:id" 
              element={<TweetDetail user={user} tweets={tweets} setTweets={setTweets} deleteTweet={deleteTweet} isAdmin={isAdmin} />} 
            />
            <Route path="*" element={<div className="text-center py-10"><h2>404 - الصفحة غير موجودة</h2></div>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
