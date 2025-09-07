/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ --- أضف هذا السطر --- ✅
  darkMode: 'class', 
  // -------------------------

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // تأكد من أن هذا المسار يغطي جميع ملفاتك
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
