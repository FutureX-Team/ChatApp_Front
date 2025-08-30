// src/pages/TweetDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Trash2 } from "lucide-react";

// دالة البحث الشاملة (تبقى كما هي)
const findTweetAnywhere = (tweets, tweetId) => {
  if (!Array.isArray(tweets)) return null;
  for (const tweet of tweets) {
    if (tweet.id === tweetId) return tweet;
    if (Array.isArray(tweet.replies)) {
      const foundInReplies = findTweetAnywhere(tweet.replies, tweetId);
      if (foundInReplies) return foundInReplies;
    }
  }
  return null;
};

export default function TweetDetail({ user, tweets, setTweets, deleteTweet, isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showReplyModal, setShowReplyModal] = useState(false);

  const tweet = findTweetAnywhere(tweets, parseInt(id));
  const cameFromReports = location.state?.from === 'reports';

  useEffect(() => {
    if (location.state?.openReply) {
      setShowReplyModal(true);
    }
  }, [location.state]);

  const addReply = (replyText) => {
    if (!replyText.trim() || !tweet) return;
    const author = user ? user : { name: "زائر" };
    const newReply = { id: Date.now(), user: author, text: replyText, up_count: 0, down_count: 0, replies: [] };

    const updateTweetsRecursively = (tweetList, targetId) => {
      if (!Array.isArray(tweetList)) return [];
      return tweetList.map(t => {
        if (t.id === targetId) {
          return { ...t, replies: [newReply, ...(t.replies || [])] };
        }
        if (Array.isArray(t.replies) && t.replies.length > 0) {
          return { ...t, replies: updateTweetsRecursively(t.replies, targetId) };
        }
        return t;
      });
    };
    setTweets(updateTweetsRecursively(tweets, tweet.id));
    setShowReplyModal(false);
  };

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذه التغريدة؟")) {
      deleteTweet(tweet.id);
      navigate('/reports');
    }
  };

  // ✅ --- التصحيح هنا: إعادة المحتوى الكامل لرسالة الخطأ ---
  if (!tweet) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">التغريدة غير موجودة</h2>
        <p className="text-gray-500 mb-4">ربما تم حذفها أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* ✅ --- التصحيح هنا: إعادة المحتوى الكامل لإجراءات المدير --- */}
      {isAdmin && cameFromReports && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
          <p className="font-bold">إجراءات المدير</p>
          <button onClick={handleDelete} className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
            <Trash2 size={16} />
            حذف التغريدة
          </button>
        </div>
      )}

      {/* التغريدة الرئيسية */}
      <Tweet tweet={tweet} />

      {/* <button
        onClick={() => setShowReplyModal(true)}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        الرد على هذه التغريدة
      </button> */}

      {showReplyModal && (
        <Modal
          onClose={() => setShowReplyModal(false)}
          onSubmit={addReply}
          title={`رد على ${tweet.user.name}`}
        />
      )}

      {/* الردود */}
      {tweet.replies && tweet.replies.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map(reply => (
            <Tweet key={reply.id} tweet={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
