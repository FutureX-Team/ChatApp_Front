import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Settings({ user, setUser }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name, email });
    if(password) alert("تم تحديث كلمة المرور"); 
    alert("تم حفظ الإعدادات!");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (!user) return <p className="p-4">الرجاء تسجيل الدخول للوصول للإعدادات.</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Navbar */}
      <div className="flex items-center p-4 shadow-md bg-white dark:bg-gray-800">
        <Link to="/" className="mr-4 text-blue-500">🏠 العودة للرئيسية</Link>
        <h1 className="text-xl font-bold">الإعدادات</h1>
      </div>

      {/* الفورم */}
      <div className="flex justify-center items-start mt-8">
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96">
          <h2 className="text-2xl mb-4">إعدادات الحساب</h2>
          <input 
            type="text" 
            placeholder="الاسم" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 mb-4 border rounded" 
            required
          />
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
            placeholder="كلمة المرور الجديدة" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 mb-4 border rounded" 
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-2">حفظ</button>
          <button type="button" onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded mt-2">تسجيل الخروج</button>
        </form>
      </div>
    </div>
  );
}
