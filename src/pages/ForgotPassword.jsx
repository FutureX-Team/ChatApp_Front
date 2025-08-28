import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${email}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">نسيت كلمة المرور</h2>
        <input
          type="email"
          placeholder="الايميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-2">إرسال</button>
      </form>
    </div>
  );
}
