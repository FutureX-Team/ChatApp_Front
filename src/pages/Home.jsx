import { useState } from "react";
import Navbar from "../components/Navbar";
import Tweet from "../components/Tweet";

// بيانات وهمية للتغريدات مع ردود وعدد الإعجابات والديسلايك
const tweetsData = [
  { 
    id: 1, 
    content: "مرحبًا! هذه أول تغريدة على المنصة.", 
    user: { name: "أحمد", avatar: "/avatar1.png" }, 
    location: "Riyadh",
    replies: [],
    likes: 5,
    dislikes: 2
  },
  { 
    id: 2, 
    content: "تجربة أخرى للتغريدات القصيرة.", 
    user: { name: "سارة", avatar: "/avatar2.png" }, 
    location: "Jeddah",
    replies: [],
    likes: 2,
    dislikes: 3
  },
];

export default function Home({ user, isAdmin, darkMode, setDarkMode }) {
  const [tweets, setTweets] = useState(tweetsData);
  const [filterLocation, setFilterLocation] = useState("");
  const [sortOption, setSortOption] = useState(""); // like أو dislike
  const [showSort, setShowSort] = useState(false);

  const handleReport = (id) => alert(`تم الإبلاغ عن التغريدة رقم ${id}`);

  // تصفية حسب المكان
  let filteredTweets = filterLocation
    ? tweets.filter(t => t.location === filterLocation)
    : [...tweets];

  // ترتيب حسب الفلتر
  if (sortOption === "like") filteredTweets.sort((a,b) => b.likes - a.likes);
  if (sortOption === "dislike") filteredTweets.sort((a,b) => b.dislikes - a.dislikes);

  return (
    <div>
      <Navbar user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="p-4 max-w-xl mx-auto">
<div className="mb-4 flex items-center gap-2">
  {/* فلتر المكان */}
  <select
    value={filterLocation}
    onChange={(e) => setFilterLocation(e.target.value)}
    className={`p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
  >
    <option value="">كل الأماكن</option>
    <option value="Riyadh">الرياض</option>
    <option value="Jeddah">جدة</option>
  </select>

  {/* أيقونة الفلترة */}
  <div className="relative">
    <button
      onClick={() => setShowSort(prev => !prev)}
      className={`p-2 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
    >
      ⚙️
    </button>
    {showSort && (
      <div className={`absolute mt-1 right-0 ${darkMode ? "bg-gray-700 text-white border border-gray-600" : "bg-white text-black border"} rounded shadow-md z-10`}>
        <button
          onClick={() => { setSortOption("like"); setShowSort(false); }}
          className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left"
        >
          أكثر إعجاب
        </button>
        <button
          onClick={() => { setSortOption("dislike"); setShowSort(false); }}
          className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left"
        >
          أكثر ديسلايك
        </button>
      </div>
    )}
  </div>
</div>


        {/* عرض التغريدات */}
        {filteredTweets.map(tweet => (
          <Tweet key={tweet.id} tweet={tweet} onReport={handleReport} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
