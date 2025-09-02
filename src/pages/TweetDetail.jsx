import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";

export default function TweetDetail({ user }) {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);

  // جلب التغريدة من السيرفر
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/tweets/${id}`);
        if (mounted) setTweet(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleAddReply = async (replyText) => {
    if (!replyText?.trim()) return;
    try {
      const { data } = await api.post(`/tweets/${tweet.id}/reply`, { text: replyText });
      setTweet(prev => ({
        ...prev,
        replies: [data.data || data, ...(prev.replies || [])]
      }));
      setShowReplyModal(false);
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الرد. الرجاء المحاولة مرة أخرى.");
    }
  };

  if (loading) return <div className="text-center py-10">جاري تحميل التغريدة...</div>;
  if (!tweet) return <div className="text-center py-10">التغريدة غير موجودة</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {showReplyModal && (
        <Modal
          onClose={() => setShowReplyModal(false)}
          onSubmit={handleAddReply}
          title={`الرد على ${tweet.user?.name || 'تغريدة'}`}
          placeholder="اكتب ردك..."
          submitLabel="رد"
        />
      )}

      <Tweet tweet={tweet} currentUser={user} />

      {user && (
        <div className="px-4 py-2">
          <button
            onClick={() => setShowReplyModal(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            إضافة رد
          </button>
        </div>
      )}

      {tweet.replies?.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map((reply) => (
            <Tweet key={reply.id} tweet={reply} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  );
}