// components/Tweet.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal, Flag, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import ReportModal from "./ReportModal";
import api from "../api/api";

export default function Tweet({ tweet, currentUser, onReply, onDelete }) {
  const [likes, setLikes] = useState(tweet.up_count ?? 0);
  const [dislikes, setDislikes] = useState(tweet.down_count ?? 0);
  const [replyCount, setReplyCount] = useState(
    tweet.replies_count ?? (Array.isArray(tweet.replies) ? tweet.replies.length : 0)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const dropdownRef = useRef(null);

  const [voted, setVoted] = useState(null);

  const authorUsername =
    tweet?.user?.username ?? tweet?.user?.name ?? tweet?.guest?.name ?? "Unknown";
  const isReply = Boolean(tweet.reply_to_tweet_id);

  // هل المستخدم يملك صلاحية الحذف؟
  const canDelete =
    !!currentUser &&
    (
      currentUser.id === (tweet.user_id ?? tweet.user?.id) ||
      currentUser.is_admin === true ||
      currentUser.role === "admin"
    );

  useEffect(() => {
    const key = voteKey(tweet.id, currentUser?.id);
    const saved = localStorage.getItem(key);
    if (saved === "like" || saved === "dislike") setVoted(saved);
  }, [tweet.id, currentUser?.id]);

  useEffect(() => {
    setLikes(tweet.up_count ?? 0);
    setDislikes(tweet.down_count ?? 0);
    setReplyCount(tweet.replies_count ?? (Array.isArray(tweet.replies) ? tweet.replies.length : 0));
  }, [tweet]);

  // إغلاق القائمة عند الضغط خارجها أو زر Esc
  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setDropdownOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const voteKey = (tweetId, userId) => `vote:${tweetId}:${userId ?? "guest"}`;

  const timeAgo = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    if (s < 60) return `${s} ث`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} د`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} س`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days} ي`;
    return d.toLocaleString("ar-SA", { hour12: false });
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return alert("سجّل الدخول أولاً");
    if (voted) return;
    setVoted("like");
    localStorage.setItem(voteKey(tweet.id, currentUser?.id), "like");
    setLikes((l) => l + 1);
    try {
      const res = await api.post(`/tweets/${tweet.id}/like`);
      setLikes(res.data?.up_count ?? likes + 1);
      setDislikes(res.data?.down_count ?? dislikes);
    } catch (err) {
      setVoted(null);
      localStorage.removeItem(voteKey(tweet.id, currentUser?.id));
      setLikes((l) => Math.max(0, l - 1));
      console.error(err);
      alert("تعذّر تسجيل الإعجاب");
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return alert("سجّل الدخول أولاً");
    if (voted) return;
    setVoted("dislike");
    localStorage.setItem(voteKey(tweet.id, currentUser?.id), "dislike");
    setDislikes((d) => d + 1);
    try {
      const res = await api.post(`/tweets/${tweet.id}/dislike`);
      setLikes(res.data?.up_count ?? likes);
      setDislikes(res.data?.down_count ?? dislikes + 1);
    } catch (err) {
      setVoted(null);
      localStorage.removeItem(voteKey(tweet.id, currentUser?.id));
      setDislikes((d) => Math.max(0, d - 1));
      console.error(err);
      alert("تعذّر تسجيل عدم الإعجاب");
    }
  };

  const handleReportSubmit = async (reason) => {
    if (!reason) return alert("اختر سبب الإبلاغ");
    try {
      await api.post(`/reports`, { tweet_id: tweet.id, reason });
      alert("تم إرسال البلاغ بنجاح");
      setShowReportModal(false);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال البلاغ");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    if (!canDelete) return;
    if (!confirm("هل أنت متأكد من حذف التغريدة؟ الإجراء غير قابل للتراجع.")) return;
    try {
      await api.delete(`/tweets/${tweet.id}`);
      // دع الأب يقرر ماذا يفعل بعد الحذف (إزالة العنصر أو الرجوع)
      onDelete?.(tweet.id);
    } catch (err) {
      console.error(err);
      alert("تعذّر حذف التغريدة");
    }
  };

  return (
    <>
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md relative text-gray-900 dark:text-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Avatar name={authorUsername} />
            <div className="ml-3">
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold mr-[10px]">{authorUsername}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(tweet.created_at)}
                </span>
              </div>

              {isReply && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  ↪︎ ردًا على{" "}
                  <Link to={`/tweet/${tweet.reply_to_tweet_id}`} className="underline">
                    هذه التغريدة
                  </Link>
                </div>
              )}

              <p className="mt-1 whitespace-pre-wrap break-words">{tweet.text ?? ""}</p>
            </div>
          </div>

          {currentUser && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setDropdownOpen((p) => !p); }}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MoreHorizontal size={20} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-20 overflow-hidden">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }}
                    className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Flag size={16} /> إبلاغ عن التغريدة
                  </button>

                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Trash2 size={16} /> حذف التغريدة
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12">
          <button
            onClick={handleLike}
            disabled={!!voted}
            className={`flex items-center gap-1 ${voted === "like" ? "text-green-600" : "hover:text-green-500"} ${voted ? "opacity-70 cursor-not-allowed" : ""}`}
            title={voted ? "لقد اخترت رأيك" : "أعجبني"}
          >
            <ArrowUp size={16} /> {likes}
          </button>

          <button
            onClick={handleDislike}
            disabled={!!voted}
            className={`flex items-center gap-1 ${voted === "dislike" ? "text-red-600" : "hover:text-red-500"} ${voted ? "opacity-70 cursor-not-allowed" : ""}`}
            title={voted ? "لقد اخترت رأيك" : "لم يعجبني"}
          >
            <ArrowDown size={16} /> {dislikes}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); if (onReply) onReply(); }}
            className="flex items-center gap-1 hover:text-blue-500"
            title="الردود"
          >
            <MessageSquare size={16} /> {replyCount}
          </button>
        </div>
      </div>
    </>
  );
}
