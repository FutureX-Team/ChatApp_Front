import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Tweet from "../components/Tweet";

// بيانات وهمية للتغريدات مع الردود
const tweetsData = [
  { 
    id: 1, 
    content: "مرحبًا! هذه أول تغريدة على المنصة.", 
    user: { name: "أحمد", avatar: "/avatar1.png" }, 
    location: "Riyadh",
    replies: [
      { id: 101, content: "رد جميل!", user: { name: "سارة", avatar: "/avatar2.png" }, replies: [] },
      { id: 102, content: "موافق!", user: { name: "محمد", avatar: "/avatar3.png" }, replies: [] }
    ]
  },
  { 
    id: 2, 
    content: "تجربة أخرى للتغريدات القصيرة.", 
    user: { name: "سارة", avatar: "/avatar2.png" }, 
    location: "Jeddah",
    replies: []
  },
];

export default function TweetDetail({ user, isAdmin, darkMode, setDarkMode }) {
  const { id } = useParams();
  const tweet = tweetsData.find(t => t.id === parseInt(id));

  if (!tweet) return <p className="p-4">التغريدة غير موجودة</p>;

  const handleReport = (id) => alert(`تم الإبلاغ عن التغريدة رقم ${id}`);

  return (
    <div>
      <Navbar user={user} isAdmin={isAdmin} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="p-4 max-w-xl mx-auto">
        <Tweet tweet={tweet} onReport={handleReport} />
        <h3 className="text-lg font-bold mt-4 mb-2">الردود</h3>
        {tweet.replies.map(reply => (
          <Tweet key={reply.id} tweet={reply} onReport={handleReport} />
        ))}
      </div>
    </div>
  );
}
