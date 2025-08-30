// src/pages/TweetDetail.jsx

import { useParams, useNavigate, useLocation } from "react-router-dom";
import Tweet from "../components/Tweet";
import { Trash2 } from "lucide-react";

// ✅ 1. دالة بحث شاملة تبحث في التغريدات والردود
const findTweetAnywhere = (tweets, tweetId) => {
  for (const tweet of tweets) {
    // إذا كانت هي التغريدة المطلوبة
    if (tweet.id === tweetId) {
      return tweet;
    }
    // إذا كانت لديها ردود، ابحث بداخلها
    if (tweet.replies && tweet.replies.length > 0) {
      const foundInReplies = findTweetAnywhere(tweet.replies, tweetId);
      if (foundInReplies) {
        return foundInReplies;
      }
    }
  }
  // إذا لم يتم العثور عليها
  return null;
};


export default function TweetDetail({ tweets, user, deleteTweet, isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const cameFromReports = location.state?.from === 'reports';

  if (!Array.isArray(tweets)) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  // ✅ 2. استخدام دالة البحث الشاملة للعثور على التغريدة
  const tweet = findTweetAnywhere(tweets, parseInt(id));

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذه التغريدة؟")) {
      // ملاحظة: دالة الحذف الحالية لا تحذف الردود، فقط التغريدات الرئيسية
      deleteTweet(tweet.id);
      navigate('/reports');
    }
  };

  if (!tweet) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">التغريدة غير موجودة</h2>
        <p className="text-gray-500 mb-4">ربما تم حذفها أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
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

      {/* عرض التغريدة/الرد الذي تم الضغط عليه */}
      <Tweet tweet={tweet} currentUser={user} />

      {/* عرض الردود الخاصة بهذه التغريدة (إن وجدت) */}
      {tweet.replies && tweet.replies.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6 text-gray-900 dark:text-white">الردود</h3>
          {tweet.replies.map(reply => (
            <Tweet key={reply.id} tweet={reply} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  );
}
