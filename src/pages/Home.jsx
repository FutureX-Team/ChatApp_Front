import { useState, useEffect } from "react";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import api from "../api/api";
import { showErrorToast } from "../utils/toast";

export default function Home({ user }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get("/tweets", { signal: ac.signal });
        setTweets(Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data));
      } catch (err) {
        showErrorToast(err, "تعذّر تحميل التغريدات.");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const handleAddReply = async (replyData) => {
    const text = typeof replyData === "string" ? replyData : replyData?.text?.toString() ?? "";
    if (!text.trim() || !replyingTo) return;

    try {
      const res = await api.post(`/tweets/${replyingTo.id}/reply`, { text });
      let newReply = Array.isArray(res.data) ? res.data[0] : res.data;
      setTweets(prev => prev.map(t => t.id === replyingTo.id ? {...t, replies: [newReply, ...(t.replies ?? [])]} : t));
      setShowReplyModal(false);
      setReplyingTo(null);
    } catch (err) {
      showErrorToast(err, "فشل إرسال الرد.");
    }
  };

  const handleDelete = (tweetId) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
    api.delete(`/tweets/${tweetId}`).catch(err => showErrorToast(err, "تعذّر حذف التغريدة."));
  };

  if (loading) return <div className="text-center py-10">جاري تحميل التغريدات...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {showReplyModal && <Modal onClose={()=>setShowReplyModal(false)} onSubmit={handleAddReply} title={`الرد على ${replyingTo.user?.name ?? "التغريدة"}`} placeholder="اكتب ردك..." submitLabel="رد"/>}
      {tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} currentUser={user} onReply={()=>{setReplyingTo(tweet); setShowReplyModal(true);}} onDelete={handleDelete} />)}
    </div>
  );
}
