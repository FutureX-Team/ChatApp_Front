
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";




function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // هنا تنادي API لإرسال رابط إعادة الضبط
    // مثال وهمي:
    console.log("طلب استعادة لك:", email);

    // قم بتحديث الواجهة أن الرسالة أرسلت
    setSent(true);

    // لو حاب ترجع للودجت Login بعد ثواني:
    // setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">نسيت كلمة المرور</h2>
        <p className="text-sm text-gray-600 mb-6">
          أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.
        </p>

        {sent ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">
              تم إرسال رابط إعادة التعيين إلى بريدك — افحص صندوق الوارد أو الرسائل غير المرغوب فيها.
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              رجوع لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded transition-colors duration-300 hover:bg-blue-700"
            >
              إرسال رابط إعادة التعيين
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => navigate("/")}
              >
                تذكرت كلمة المرور؟ تسجيل الدخول
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
