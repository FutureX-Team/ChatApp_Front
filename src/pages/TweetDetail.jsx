import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";
import { showErrorToast } from "../utils/toast";
import toast from "react-hot-toast"; // ✨ أضفه هنا

const normalize = (res) =>
  Array.isArray(res.data) ? res.data : res.data?.data ?? res.data;

export default function TweetDetail({ user }) {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

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
      const res = await api.post(`/tweets/${replyingTo.id}/reply`, { text });
      let newReply = normalize(res);
      if (!newReply.user && newReply?.id) {
        newReply = normalize(await api.get(`/tweets/${newReply.id}`));
      }

      // إنشاء نسخة جديدة من الشجرة بالكامل
      const addReplyToTree = (t) => {
        if (!t) return null;
        if (t.id === replyingTo.id) {
          return {
            ...t,
            replies_count: (t.replies_count ?? 0) + 1,
            replies: [newReply, ...(t.replies ?? [])].map((r) => ({ ...r })), // نسخة جديدة لكل عنصر
          };
        }
        return { ...t, replies: (t.replies ?? []).map(addReplyToTree) };
      };

      setTweet((prev) => ({ ...addReplyToTree(prev) })); // **نسخة جديدة للتغريدة كلها**

      setShowReplyModal(false);
      setReplyingTo(null);
      toast.success("تم إرسال الرد بنجاح ✅");
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
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
