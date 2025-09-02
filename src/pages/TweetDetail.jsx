import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";

export default function TweetDetail({ user, onAddReply }) {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tweets/${id}`); // جلب التغريدة من السيرفر مباشرة
        if (mounted) setTweet(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleAddReply = async (text) => {
    if (!text.trim() || !tweet) return;
    try {
      const { data } = await api.post(`/tweets/${tweet.id}/reply`, { text });
      const newReply = data?.data || data;
      setTweet(prev => ({
        ...prev,
        replies: [newReply, ...(prev.replies || [])]
      }));
      if (onAddReply) onAddReply(tweet.id, newReply);
      setShowReplyModal(false);
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الرد.");
    }
  };

  if (loading) return <div className="text-center py-10">جاري تحميل التغريدة...</div>;
  if (!tweet) return <div className="text-center py-10">التغريدة غير موجودة</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Tweet tweet={tweet} currentUser={user} />
      <button
        onClick={() => setShowReplyModal(true)}
        className="w-full bg-blue-500 text-white py-2 rounded-full mt-4"
      >
        أضف ردك
      </button>
      {showReplyModal && (
        <Modal onClose={() => setShowReplyModal(false)} onSubmit={handleAddReply} title="اكتب ردك" />
      )}
      {tweet.replies?.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4 mt-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map(reply => (
            <Tweet key={reply.id} tweet={reply} currentUser={user} onReply={() => setShowReplyModal(true)} />
          ))}
        </div>
      )}
    </div>
  );
}
