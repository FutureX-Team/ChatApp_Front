// src/pages/Support.jsx

const SUPPORT_EMAIL = "basel123496@gmail.com"; 

export default function Support({ currentUser }) {

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">الدعم الفني</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        إذا واجهت أي مشكلة أو لديك أي استفسار، لا تتردد في التواصل معنا عبر البريد الإلكتروني.
      </p>
      <h2><a style={{ color: "blue", textDecoration: "underline" }} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></h2>
      <br />
      
    </div>
  );
}
