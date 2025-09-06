import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";

const normalize = (res) => (Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data));

export default function TweetDetail({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const initialOpen = location.state?.openReply === true;

  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get(`/tweets/${id}`, { signal: ac.signal });
        const data = normalize(res);
        setTweet(data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  useEffect(() => {
    if (initialOpen) setShowReplyModal(true);
  }, [initialOpen]);

  const handleAddReply = async (replyText) => {
const text = typeof replyText === "string" ? replyText.trim() : replyText?.text?.trim();
if (!text) return;

    try {
      const res = await api.post(`/tweets/${tweet.id}/reply`, { text });

      let created = normalize(res);

      // ensure the reply includes its user for immediate render
      if (!created.user) {
        const full = await api.get(`/tweets/${created.id}`);
        created = normalize(full);
      }

      setTweet((prev) => ({
        ...prev,
        replies_count: (prev?.replies_count ?? prev?.replies?.length ?? 0) + 1,
        replies: [created, ...(prev?.replies ?? [])],
      }));
      setShowReplyModal(false);
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الرد. الرجاء المحاولة مرة أخرى.");
    }
  };

  if (loading) return <div className="text-center py-10">جاري تحميل التغريدة...</div>;
  if (!tweet) return <div className="text-center py-10">التغريدة غير موجودة</div>;

  const authorTitle = tweet.user?.name ?? tweet.user?.username ?? "تغريدة";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {showReplyModal && (
        <Modal
          onClose={() => setShowReplyModal(false)}
          onSubmit={handleAddReply}
          title={`الرد على ${authorTitle}`}
          placeholder="اكتب ردك..."
          submitLabel="رد"
        />
      )}

      <Tweet tweet={tweet} currentUser={user} />

      {user && (
        <div className="px-4 py-2">
          {/* <button
            onClick={() => setShowReplyModal(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            إضافة رد
          </button> */}
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
