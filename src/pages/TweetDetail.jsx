import { useParams, useNavigate, useLocation } from "react-router-dom";
import Tweet from "../components/Tweet";
import { Trash2 } from "lucide-react";

// البحث في التغريدات والردود
const findTweetAnywhere = (tweets, tweetId) => {
  for (const t of tweets) {
    if (t.id === tweetId) return t;
    if (t.replies?.length) {
      const found = findTweetAnywhere(t.replies, tweetId);
      if (found) return found;
    }
  }
  return null;
};

export default function TweetDetail({ tweets, user, deleteTweet, isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromReports = location.state?.from === "reports";

  if (!Array.isArray(tweets)) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  const tweet = findTweetAnywhere(tweets, parseInt(id, 10));

  const handleDelete = () => {
    if (!tweet) return;
    if (window.confirm("هل أنت متأكد من حذف هذه التغريدة؟")) {
      deleteTweet(tweet.id);
      navigate("/reports");
    }
  };

  if (!tweet) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">التغريدة غير موجودة</h2>
        <p className="text-gray-500 mb-4">ربما تم حذفها أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {isAdmin && cameFromReports && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
          <p className="font-bold">إجراءات المدير</p>
          <button onClick={handleDelete} className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
            <Trash2 size={16} />
            حذف التغريدة
          </button>
        </div>
      )}

      <Tweet tweet={tweet} currentUser={user} />

      {tweet.replies?.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map((reply) => (
            <Tweet key={reply.id} tweet={reply} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  );
}
