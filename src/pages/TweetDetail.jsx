import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";

const normalize = (res) => Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data);

export default function TweetDetail({ user }) {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // التغريدة أو الرد اللي نريد الرد عليه

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

  const handleAddReply = async (replyData) => {
    // استخرج النص سواء جاء ككائن أو string
    const text =
      typeof replyData === "string"
        ? replyData
        : replyData?.text?.toString() ?? "";

    if (!text.trim() || !replyingTo) return;

    try {
      const res = await api.post(`/tweets/${replyingTo.id}/reply`, { text });
      let newReply = normalize(res);

      // تأكد من وجود بيانات المستخدم للعرض الفوري
      if (!newReply.user && newReply?.id) {
        const full = await api.get(`/tweets/${newReply.id}`);
        newReply = normalize(full);
      }

      // تحديث شجرة الردود بشكل متداخل
      const addReplyToTree = (t) => {
        if (t.id === replyingTo.id) {
          return {
            ...t,
            replies_count: (t.replies_count ?? 0) + 1,
            replies: [newReply, ...(t.replies ?? [])],
          };
        }
        return {
          ...t,
          replies: (t.replies ?? []).map(addReplyToTree),
        };
      };

      setTweet((prev) => addReplyToTree(prev));
      setShowReplyModal(false);
      setReplyingTo(null);
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
          title={`الرد على ${replyingTo.user?.name ?? "التغريدة"}`}
          placeholder="اكتب ردك..."
          submitLabel="رد"
        />
      )}

      <Tweet
        tweet={tweet}
        currentUser={user}
        onReply={(t) => {
          setReplyingTo(tweet); // الرد على التغريدة الأصلية
          setShowReplyModal(true);
        }}
      />

      {tweet.replies?.length > 0 && (
        <div className="border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map((reply) => (
            <Tweet
              key={reply.id}
              tweet={reply}
              currentUser={user}
              onReply={(t) => {
                setReplyingTo(reply); // الرد على هذا الرد
                setShowReplyModal(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
