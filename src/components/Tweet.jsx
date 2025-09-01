// src/components/Tweet.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import api from "../api/api";

export default function Tweet({ tweet, currentUser }) {
  const [likes, setLikes] = useState(Number(tweet?.up_count) || 0);
  const [dislikes, setDislikes] = useState(Number(tweet?.down_count) || 0);
  const navigate = useNavigate();

  if (!tweet || !tweet?.id) return null;

  const username =
    tweet?.user?.username ?? tweet?.user?.name ?? tweet?.username ?? "Unknown";
  const text = tweet?.text ?? "";

  const handleInteraction = async (e, action) => {
    e.stopPropagation();
    try {
      if (action === "like") {
        const res = await api.post(`/tweets/${tweet.id}/like`);
        setLikes(
          typeof res?.data?.up_count === "number"
            ? res.data.up_count
            : (v) => v + 1
        );
      } else if (action === "dislike") {
        const res = await api.post(`/tweets/${tweet.id}/dislike`);
        setDislikes(
          typeof res?.data?.down_count === "number"
            ? res.data.down_count
            : (v) => v + 1
        );
      } else if (action === "reply") {
        // ✅ نفس طريقتك: نفتح صفحة التغريدة مع فتح محرّر الرد
        navigate(`/tweet/${tweet.id}`, { state: { openReply: true } });
      }
    } catch {
      if (action === "like") setLikes((v) => v + 1);
      if (action === "dislike") setDislikes((v) => v + 1);
      if (action === "reply")
        navigate(`/tweet/${tweet.id}`, { state: { openReply: true } });
    }
  };

  return (
    <div
      onClick={() => navigate(`/tweet/${tweet.id}`)}
      className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start">
        <Avatar name={username} />
        <div className="flex-1 ml-3">
          <h3 className="font-bold">{username}</h3>
          <p className="mt-1 whitespace-pre-wrap">{text}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12">
        <button
          onClick={(e) => handleInteraction(e, "like")}
          className="flex items-center gap-1 hover:text-green-500"
        >
          <ArrowUp size={16} /> {likes}
        </button>

        <button
          onClick={(e) => handleInteraction(e, "dislike")}
          className="flex items-center gap-1 hover:text-red-500"
        >
          <ArrowDown size={16} /> {dislikes}
        </button>

        <button
          onClick={(e) => handleInteraction(e, "reply")}
          className="flex items-center gap-1 hover:text-blue-500"
          title="رد"
        >
          <MessageSquare size={16} />
          {Array.isArray(tweet.replies) && tweet.replies.length > 0 && (
            <span className="text-xs">{tweet.replies.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}
