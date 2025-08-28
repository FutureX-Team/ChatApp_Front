import { Link } from "react-router-dom";
import Tweet from "../components/Tweet";

export default function Profile({ user, tweets, darkMode }) {
  if (!user) return <p className="p-4">الرجاء تسجيل الدخول لعرض الملف الشخصي.</p>;

  // تأكد أن tweets موجودة
  const userTweets = tweets?.filter(t => t.user.email === user.email) || [];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Navbar */}
      <div className={`flex items-center p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <Link to="/" className="mr-4 text-blue-500">🏠 العودة للرئيسية</Link>
        <h1 className="text-xl font-bold">الملف الشخصي</h1>
      </div>

      {/* الملف الشخصي */}
      <div className="flex flex-col items-center mt-8 mb-8">
        <img src={user.avatar} className="h-24 w-24 rounded-full mb-2" alt="avatar" />
        <h2 className="text-xl font-bold">{user.name}</h2>
      </div>

      {/* التغريدات */}
      <div className="max-w-xl mx-auto">
        {userTweets.map(tweet => (
          <Tweet key={tweet.id} tweet={tweet} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
