// src/pages/TweetDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet"; // تأكد من استيراد مكون التغريدة

// ✅ 1. استقبال tweets و user كـ props
export default function TweetDetail({ tweets, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ 2. التحقق من أن tweets هي مصفوفة قبل استخدامها
  if (!Array.isArray(tweets)) {
    // يمكنك عرض رسالة تحميل أو خطأ هنا
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  // ✅ 3. البحث عن التغريدة في المصفوفة التي تم تمريرها
  const tweet = tweets.find(t => t.id === parseInt(id));

  if (!tweet) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">التغريدة غير موجودة</h2>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* عرض التغريدة الرئيسية */}
      <Tweet tweet={tweet} currentUser={user} />

      {/* عرض الردود */}
      {tweet.replies && tweet.replies.length > 0 && (
        <div className="ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-bold mt-6">الردود</h3>
          {tweet.replies.map(reply => (
            <Tweet key={reply.id} tweet={reply} currentUser={user} />
          ))}
        </div>
      )}
    </div>
  );
}
