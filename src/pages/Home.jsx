import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import api from "../api/api";

// دالة لإضافة الرد بشكل متداخل
const addReplyRecursive = (tweets, tweetId, reply) => {
  return tweets.map(t => {
    if (t.id === tweetId) {
      return { ...t, replies: [reply, ...(t.replies || [])] };
    }
    if (t.replies?.length) {
      return { ...t, replies: addReplyRecursive(t.replies, tweetId, reply) };
    }
    return t;
  });
};

export default function Home({ user }) {
  const [tweets, setTweets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get("/tweets");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (mounted) setTweets(list);
      } catch (e) {
        console.error(e);
        if (mounted) setError("تعذر تحميل التغريدات.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const addTweet = async (text) => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/tweets", { text });
      const created = Array.isArray(res.data) ? res.data[0] : (res.data?.data || res.data);
      setTweets([created, ...tweets]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("فشل نشر التغريدة.");
    }
  };

  const addReplyToTweet = (tweetId, reply) => {
    setTweets(prev => addReplyRecursive(prev, tweetId, reply));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-full shadow-lg z-40"
        title="إضافة تغريدة جديدة"
      >
        <Plus size={28} />
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onSubmit={addTweet} title="تغريدة جديدة" />
      )}

      {loading && <div className="py-8 text-center">جاري تحميل التغريدات...</div>}
      {error && !loading && <div className="py-4 text-center text-red-600">{error}</div>}

      {!loading && (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              currentUser={user}
              onReply={() => navigate(`/tweet/${tweet.id}`, { state: { openReply: true } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
