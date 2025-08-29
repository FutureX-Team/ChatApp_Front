import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Avatar from "./Avatar";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";

export default function Tweet({ tweet, currentUser }) {
  const [likes, setLikes] = useState(tweet.up_count || 0);
  const [dislikes, setDislikes] = useState(tweet.down_count || 0);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const navigate = useNavigate();

  const handleInteraction = (e, action) => {
    e.stopPropagation();
    if (action === 'like') setLikes(likes + 1);
    if (action === 'dislike') setDislikes(dislikes + 1);
    if (action === 'reply') setShowReplyModal(true);
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/tweet/${tweet.id}`)} 
        // ✅ تعديل خلفية ولون نص التغريدة
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-md cursor-pointer"
      >
        <div className="flex items-start">
          <Avatar name={tweet.user.name} />
          <div className="flex-1 ml-3">
            <h3 className="font-bold">{tweet.user.name}</h3>
            <p className="mt-1 whitespace-pre-wrap">{tweet.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12">
          <button onClick={(e) => handleInteraction(e, 'like')} className="flex items-center gap-1 hover:text-green-500">
            <ArrowUp size={16} /> {likes}
          </button>
          <button onClick={(e) => handleInteraction(e, 'dislike')} className="flex items-center gap-1 hover:text-red-500">
            <ArrowDown size={16} /> {dislikes}
          </button>
          {currentUser && (
            <button onClick={(e) => handleInteraction(e, 'reply')} className="flex items-center gap-1 hover:text-blue-500">
              <MessageSquare size={16} />
            </button>
          )}
        </div>
      </div>
      {showReplyModal && (
        <Modal
          onClose={() => setShowReplyModal(false)}
          onSubmit={(text) => { console.log(text); setShowReplyModal(false); }}
          title={`رد على ${tweet.user.name}`}
        />
      )}
    </>
  );
}
