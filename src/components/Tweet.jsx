// src/components/Tweet.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal, Flag } from "lucide-react";
import Avatar from "./Avatar";
import ReportModal from "./ReportModal";
import api from "../api/api";

export default function Tweet({ tweet, currentUser, onReply }) {
  // ===== Guards (بدون return مبكر)
  const invalid = !tweet || !tweet.id;

  // ===== Helpers
  const voteKey = useCallback((tweetId, userId) => `vote:${tweetId}:${userId ?? "guest"}`, []);
  const timeAgo = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return "";
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

  // ===== Derived
  const authorUsername = useMemo(
    () => (tweet?.user?.username ?? tweet?.user?.name ?? tweet?.guest?.name ?? "Unknown"),
    [tweet]
  );
  const authorAvatar = tweet?.user?.avatar_url || "";
  const isReply = Boolean(tweet?.reply_to_tweet_id);

  const baseReplyCount = useMemo(() => {
    const direct =
      tweet?.replies_count ??
      tweet?.reply_count ??
      tweet?.repliesCount ??
      tweet?.replies_count_agg ??
      null;

    if (typeof direct === "number") return direct;
    if (typeof direct === "string" && /^\d+$/.test(direct)) return Number(direct);
    if (Array.isArray(tweet?.replies)) return tweet.replies.length;
    if (Array.isArray(tweet?.replies?.data)) return tweet.replies.data.length;
    return 0;
  }, [tweet]);

  // ===== State
  const [likes, setLikes] = useState(Number(tweet?.up_count) || 0);
  const [dislikes, setDislikes] = useState(Number(tweet?.down_count) || 0);
  const [replyDelta, setReplyDelta] = useState(0); // زيادة تفاؤلية فقط
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [voted, setVoted] = useState(null); // "like" | "dislike" | null

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ===== Effects
  // مزامنة العدادات عند تغير التغريدة
  useEffect(() => {
    setLikes(Number(tweet?.up_count) || 0);
    setDislikes(Number(tweet?.down_count) || 0);
    setReplyDelta(0);
  }, [tweet?.up_count, tweet?.down_count, tweet?.id]);

  // قراءة تصويت المستخدم المخزن محليًا
  useEffect(() => {
    if (!tweet?.id) return;
    const key = voteKey(tweet.id, currentUser?.id);
    const saved = localStorage.getItem(key);
    setVoted(saved === "like" || saved === "dislike" ? saved : null);
  }, [tweet?.id, currentUser?.id, voteKey]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    if (!dropdownOpen) return;
    const onDocClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [dropdownOpen]);

  // ===== Actions
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser || !tweet?.id) return alert("سجّل الدخول أولاً");

    // لو تبغى السماح بالتبديل/الإلغاء، فعّل المنطق أدناه
    if (voted) return;

    setVoted("like");
    localStorage.setItem(voteKey(tweet.id, currentUser?.id), "like");
    setLikes((l) => l + 1); // تفاؤلي
    try {
      const res = await api.post(`/tweets/${tweet.id}/like`);
      if (typeof res?.data?.up_count === "number") setLikes(res.data.up_count);
      if (typeof res?.data?.down_count === "number") setDislikes(res.data.down_count);
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
    if (!currentUser || !tweet?.id) return alert("سجّل الدخول أولاً");
    if (voted) return;

    setVoted("dislike");
    localStorage.setItem(voteKey(tweet.id, currentUser?.id), "dislike");
    setDislikes((d) => d + 1);
    try {
      const res = await api.post(`/tweets/${tweet.id}/dislike`);
      if (typeof res?.data?.down_count === "number") setDislikes(res.data.down_count);
      if (typeof res?.data?.up_count === "number") setLikes(res.data.up_count);
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

  // ===== Render
  if (invalid) return null;

  return (
    <>
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
      )}

      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md relative text-gray-900 dark:text-gray-200 w-full"
        onClick={() => navigate(`/tweet/${tweet.id}`)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Avatar name={authorUsername} url={authorAvatar} />
            <div className="ml-3 w-full cursor-pointer">
              {/* header */}
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold mr-[10px]">{authorUsername}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(tweet?.created_at)}
                </span>
              </div>

              {/* reply badge */}
              {isReply && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  ↪︎ ردًا على{" "}
                  <Link
                    to={`/tweet/${tweet.reply_to_tweet_id}`}
                    className="underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    هذه التغريدة
                  </Link>
                </div>
              )}

              {/* body */}
              <p className="mt-2  break-words break-all">
                {tweet?.text ?? ""}
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="خيارات"
              >
                <MoreHorizontal size={20} />
              </button>

              {dropdownOpen && (
                <div className="absolute -right-[164px] mt-1 w-48 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-20">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full px-4 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2 hover:rounded-lg"
                  >
                    <Flag size={16} /> إبلاغ عن التغريدة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400 ml-12" onClick={(e) => e.stopPropagation()}>
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
            onClick={() => {
              onReply && onReply();        // افتح مودال الرد من الأب
              setReplyDelta((d) => d + 1); // تفاؤلي فقط
            }}
            className="flex items-center gap-1 hover:text-blue-500"
            title="الردود"
          >
            <MessageSquare size={16} /> {Math.max(0, baseReplyCount + replyDelta)}
          </button>
        </div>
      </div>
    </>
  );
}