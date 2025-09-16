import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";
import { showErrorToast } from "../utils/toast";
import toast from "react-hot-toast"; // ✨

const normalize = (res) =>
  Array.isArray(res.data) ? res.data : res.data?.data ?? res.data;

export default function TweetDetail({ user }) {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // عرض رسالة toast بعد إعادة تحميل الصفحة
  useEffect(() => {
    const msg = localStorage.getItem("toastMessage");
    if (msg) {
      toast.success(msg);
      localStorage.removeItem("toastMessage");
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get(`/tweets/${id}`, { signal: ac.signal });
        setTweet(normalize(res));
      } catch (err) {
        showErrorToast(err, "تعذّر تحميل التغريدة.");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  const handleAddReply = async (replyData) => {
    const text =
      typeof replyData === "string"
        ? replyData
        : replyData?.text?.toString() ?? "";
    if (!text.trim() || !replyingTo) return;

    try {
      await api.post(`/tweets/${replyingTo.id}/reply`, { text });

      // تخزين رسالة النجاح مؤقتًا قبل إعادة تحميل الصفحة
      localStorage.setItem("toastMessage", "تم إرسال الرد بنجاح ✅");

      // إعادة تحميل الصفحة
      window.location.reload();
    } catch (err) {
      showErrorToast(err, "فشل إرسال الرد. الرجاء المحاولة مرة أخرى.");
    }
  };

  const handleDelete = (tweetId) => {
    setTweet((prev) => {
      const remove = (t) =>
        !t
          ? null
          : t.id === tweetId
          ? null
          : { ...t, replies: (t.replies ?? []).map(remove).filter(Boolean) };
      return remove(prev);
    });

    api
      .delete(`/tweets/${tweetId}`)
      .catch((err) => showErrorToast(err, "تعذّر حذف التغريدة من السيرفر"));
  };

  if (loading)
    return <div className="text-center py-10">جاري تحميل التغريدة...</div>;
  if (!tweet)
    return <div className="text-center py-10">التغريدة غير موجودة</div>;

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
        onReply={() => {
          setReplyingTo(tweet);
          setShowReplyModal(true);
        }}
        onDelete={handleDelete}
      />
      {tweet.replies?.map((reply) => (
        <Tweet
          key={reply.id}
          tweet={reply}
          currentUser={user}
          onReply={() => {
            setReplyingTo(reply);
            setShowReplyModal(true);
          }}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
