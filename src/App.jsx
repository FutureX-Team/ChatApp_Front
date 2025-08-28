import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import TweetDetail from "./pages/TweetDetail"; // ✅ أضف هذا السطر أعلى App.jsx


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // بيانات المستخدم بعد تسجيل الدخول
  const [isAdmin, setIsAdmin] = useState(false); // لتجربة Admin

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <Router>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
          <Route path="/reports" element={<Reports user={user} isAdmin={isAdmin} />} />
           <Route path="/" element={<Home user={user} setUser={setUser} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} />} />
  <Route path="/tweet/:id" element={<TweetDetail user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
