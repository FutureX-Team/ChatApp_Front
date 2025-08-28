import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser, setIsAdmin, darkMode }) {
  const [step, setStep] = useState(1); // 1: بيانات، 2: OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // هنا يمكن إرسال OTP للإيميل فعليًا
    setStep(2);
    alert("تم إرسال OTP إلى بريدك الإلكتروني (مثال وهمي)");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === "123456") { // مثال OTP ثابت
      setUser({ name, email, avatar: "/avatar2.png" });
      setIsAdmin(false);
      navigate("/");
    } else {
      alert("OTP غير صحيح");
    }
  };

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  const formBg = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const inputClass = darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300";

  return (
    <div className={`flex justify-center items-center min-h-screen ${bgClass}`}>
      {step === 1 ? (
        <form onSubmit={handleRegister} className={`p-8 rounded shadow-md w-96 ${formBg}`}>
          <h2 className="text-2xl mb-4">تسجيل جديد</h2>
          <input
            type="text"
            placeholder="الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${inputClass}`}
            required
          />
          <input
            type="email"
            placeholder="الايميل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${inputClass}`}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${inputClass}`}
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-2">
            التالي
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className={`p-8 rounded shadow-md w-96 ${formBg}`}>
          <h2 className="text-2xl mb-4">أدخل OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${inputClass}`}
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded mb-2">
            تأكيد
          </button>
        </form>
      )}
    </div>
  );
}
