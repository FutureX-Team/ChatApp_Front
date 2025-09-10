import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${email}`);
  };

  return (
    <div className="flex justify-center items-center pt-10 sm:pt-16">
      <form 
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-gray-800 dark:text-white">
          إعادة تعيين كلمة المرور
        </h2>

        {message && <p className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-sm">{message}</p>}

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني المسجل
          </label>
          <input 
            id="email"
            type="email" 
            placeholder="example@email.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          إرسال الرابط
        </button>

        <div className="text-center mt-6 text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </form>
    </div>
  );
}
