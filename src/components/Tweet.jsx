import { useState } from "react";

export default function Tweet({ tweet, darkMode }) {
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [dislikes, setDislikes] = useState(tweet.dislikes || 0);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = (e) => { e.stopPropagation(); setLikes(likes + 1); };
  const handleDislike = (e) => { e.stopPropagation(); setDislikes(dislikes + 1); };
  const handleReport = (e) => { e.stopPropagation(); alert("تم الإبلاغ عن التغريدة!"); };
  const toggleReplies = () => setShowReplies(!showReplies);

  return (
    
    <div
      className={`p-4 mb-4 rounded shadow relative cursor-pointer transition-colors duration-200 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      onClick={toggleReplies} // الضغط على أي مكان في التغريدة يفتح الردود
    >
      {/* زر الإبلاغ فوق يسار */}
      <button
        onClick={handleReport}
        className="absolute top-2 left-2 text-red-500 font-semibold hover:opacity-80 transition-opacity"
      >
        🚨 إبلاغ
      </button>

      {/* رأس التغريدة: صورة واسم المستخدم */}
      <div className="flex items-center mb-2">
        <img src={tweet.user.avatar} alt="avatar" className="h-10 w-10 rounded-full mr-2" />
        <span className="font-bold">{tweet.user.name}</span>
      </div>

      {/* نص التغريدة */}
      <p className="mb-2">{tweet.content}</p>

      {/* Like/Dislike تحت يسار */}
      <div className="flex items-center space-x-4 mt-2">
        <div className="flex items-center cursor-pointer" onClick={handleLike}>
          ▲ <span className="ml-1">{likes}</span>
        </div>
        <div className="flex items-center cursor-pointer" onClick={handleDislike}>
          ▼ <span className="ml-1">{dislikes}</span>
        </div>
      </div>

      {/* الردود */}
      {showReplies && tweet.replies?.length > 0 && (
        <div className="mt-4 border-t pt-2">
          {tweet.replies.map((reply, idx) => (
            <div
              key={idx}
              className={`p-2 mb-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
            >
              <div className="flex items-center mb-1">
                <img src={reply.user.avatar} alt="avatar" className="h-8 w-8 rounded-full mr-2" />
                <span className="font-bold">{reply.user.name}</span>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
