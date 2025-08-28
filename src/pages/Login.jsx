import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setUser, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // بيانات وهمية للتجربة
    if (email === "admin@example.com") {
      setUser({ name: "Admin", avatar: "/avatar1.png", email });
      setIsAdmin(true);
      alert("تم تسجيل الدخول كأدمن");
    } else if (email === "user@example.com") {
      setUser({ name: "User", avatar: "/avatar2.png", email });
      setIsAdmin(false);
      alert("تم تسجيل الدخول كمستخدم عادي");
    } else {
      alert("الايميل غير موجود في الحسابات الوهمية");
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl mb-4">تسجيل الدخول</h2>
        <input
          type="email"
          placeholder="الايميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-2">تسجيل الدخول</button>
        <Link to="/forgot-password" className="text-blue-500 hover:underline block mb-2">نسيت كلمة المرور؟</Link>
        <Link to="/register" className="text-blue-500 hover:underline">إنشاء حساب جديد</Link>
      </form>
    </div>
  );
}
