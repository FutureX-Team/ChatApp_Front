// src/components/Tweet.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ❌ لم نعد بحاجة لـ Modal هنا
import Avatar from "./Avatar";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";

// ❌ لم نعد بحاجة لتمرير setTweets و allTweets هنا، مما يبسط الكود
export default function Tweet({ tweet }) {
  const [likes, setLikes] = useState(tweet.up_count || 0);
  const [dislikes, setDislikes] = useState(tweet.down_count || 0);
  const navigate = useNavigate();

  const handleInteraction = (e, action) => {
    e.stopPropagation();
    if (action === 'like') setLikes(l => l + 1);
    if (action === 'dislike') setDislikes(d => d + 1);
  };

  // ✅ دالة جديدة للانتقال مع فتح نافذة الرد
  const goToTweetAndReply = (e) => {
    e.stopPropagation(); // منع déclenchement de l'événement onClick du parent
    navigate(`/tweet/${tweet.id}`, { state: { openReply: true } });
  };

  return (
    <div 
      onClick={() => navigate(`/tweet/${tweet.id}`)} 
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start">
        <Avatar name={tweet.user.name} />
        <div className="flex-1 ml-3">
          <h3 className="font-bold text-gray-900 dark:text-white">{tweet.user.name}</h3>
          <p className="mt-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{tweet.text}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12">
        <button onClick={(e) => handleInteraction(e, 'like')} className="flex items-center gap-1 hover:text-green-500"> <ArrowUp size={16} /> {likes} </button>
        <button onClick={(e) => handleInteraction(e, 'dislike')} className="flex items-center gap-1 hover:text-red-500"> <ArrowDown size={16} /> {dislikes} </button>
        
        {/* ✅ --- التعديل هنا: زر الرد الآن ينتقل إلى الصفحة مع حالة خاصة --- ✅ */}
        <button onClick={goToTweetAndReply} className="flex items-center gap-1 hover:text-blue-500">
          <MessageSquare size={16} />
          {tweet.replies?.length > 0 && <span className="text-xs">{tweet.replies.length}</span>}
        </button>
      </div>
    </div>
  );
}
