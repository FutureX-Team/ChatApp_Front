import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import api from "../api/api";

const normalize = (res) => (Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data));

export default function Home({ user, tweets, setTweets }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get("/tweets", { signal: ac.signal });
        const list = normalize(res);
        setTweets(list);
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error(e);
          setError("تعذر تحميل التغريدات.");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [setTweets]);

  const addTweet = useCallback(async (text) => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/tweets", { text });
      const created = normalize(res);
      setTweets((prev) => [created, ...(prev || [])]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("فشل نشر التغريدة.");
    }
  }, [setTweets]);

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
          {(tweets || []).map((tweet) => (
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
