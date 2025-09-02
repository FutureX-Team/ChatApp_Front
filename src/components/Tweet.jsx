import { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal, Flag } from "lucide-react";
import Avatar from "./Avatar";
import ReportModal from "./ReportModal";
import api from "../api/api";

export default function Tweet({ tweet, currentUser, onReply }) {
  const [likes, setLikes] = useState(tweet.up_count ?? 0);
  const [dislikes, setDislikes] = useState(tweet.down_count ?? 0);
  const [replyCount, setReplyCount] = useState(
    tweet.replies_count ?? (Array.isArray(tweet.replies) ? tweet.replies.length : 0)
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const dropdownRef = useRef(null);

  // keep local counters in sync if parent updates the tweet object
  useEffect(() => {
    setLikes(tweet.up_count ?? 0);
    setDislikes(tweet.down_count ?? 0);
    setReplyCount(tweet.replies_count ?? (Array.isArray(tweet.replies) ? tweet.replies.length : 0));
  }, [tweet]);

  const authorUsername =
    tweet?.user?.username ?? tweet?.user?.name ?? tweet?.guest?.name ?? "Unknown";

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
    // fallback full date/time
    return d.toLocaleString("ar-SA", { hour12: false });
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return alert("سجّل الدخول أولاً");
    const prev = likes;
    setLikes(prev + 1);
    try {
      const res = await api.post(`/tweets/${tweet.id}/like`);
      setLikes(res.data?.up_count ?? prev + 1);
    } catch (err) {
      setLikes(prev);
      console.error(err);
      alert("تعذّر تسجيل الإعجاب");
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return alert("سجّل الدخول أولاً");
    const prev = dislikes;
    setDislikes(prev + 1);
    try {
      const res = await api.post(`/tweets/${tweet.id}/dislike`);
      setDislikes(res.data?.down_count ?? prev + 1);
    } catch (err) {
      setDislikes(prev);
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
                <h3 className="font-bold">{authorUsername}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(tweet.created_at)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words">
                {tweet.text ?? ""}
              </p>
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
                <div className="absolute -right-[164px] mt-1 w-48 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }}
                    className="w-full px-4 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2 hover:rounded-lg"
                  >
                    <Flag size={16} /> إبلاغ عن التغريدة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12">
          <button className="flex items-center gap-1 hover:text-green-500" onClick={handleLike}>
            <ArrowUp size={16} /> {likes}
          </button>
          <button className="flex items-center gap-1 hover:text-red-500" onClick={handleDislike}>
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
