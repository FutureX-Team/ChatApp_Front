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
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get(`/tweets/${id}`, { signal: ac.signal });
        setTweet(normalize(res));
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  const handleAddReply = async (replyData) => {
    const text = typeof replyData === "string" ? replyData : replyData?.text?.toString() ?? "";
    if (!text.trim() || !replyingTo) return;

    try {
      const res = await api.post(`/tweets/${replyingTo.id}/reply`, { text });
      let newReply = normalize(res);

      if (!newReply.user && newReply?.id) {
        const full = await api.get(`/tweets/${newReply.id}`);
        newReply = normalize(full);
      }

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

  const handleDelete = (tweetId) => {
    const removeTweetFromTree = (t) => {
      if (t.id === tweetId) return null;
      return {
        ...t,
        replies: (t.replies ?? []).map(removeTweetFromTree).filter(Boolean),
      };
    };

    setTweet((prev) => removeTweetFromTree(prev));

    api.delete(`/tweets/${tweetId}`).catch((err) => {
      console.error(err);
      alert("تعذّر حذف التغريدة من السيرفر");
    });
  };

  if (loading) return <div className="text-center py-10">جاري تحميل التغريدة...</div>;
  if (!tweet) return <div className="text-center py-10">التغريدة غير موجودة</div>;

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

      {tweet.replies?.length > 0 && (
        <div className="border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map((reply) => (
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
      )}
    </div>
  );
}
