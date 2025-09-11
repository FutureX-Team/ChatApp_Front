// src/pages/Support.jsx
import toast from "react-hot-toast";

const SUPPORT_EMAIL = "basel123496@gmail.com";

export default function Support({ currentUser }) {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    toast.success("تم نسخ البريد الإلكتروني ✅");
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        الدعم الفني
      </h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        إذا واجهت أي مشكلة أو لديك أي استفسار، لا تتردد في التواصل معنا عبر البريد الإلكتروني.
      </p>

      <div className="flex items-center gap-2">
        <a
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
        <button
          onClick={handleCopyEmail}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          نسخ
        </button>
      </div>
    </div>
  );
}
