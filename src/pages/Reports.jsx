import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reports({ user, isAdmin }) {
  const navigate = useNavigate();

  // ✅ يجب استدعاء useState قبل أي return شرطي
  const [reports] = useState([
    { id: 1, tweetId: 2, reason: "إساءة" },
    { id: 2, tweetId: 1, reason: "محتوى غير مناسب" },
  ]);

  if (!user || !isAdmin) return <p className="p-4">لا يمكن الوصول إلى هذه الصفحة.</p>;

  const handleViewTweet = (tweetId) => {
    alert(`فتح التغريدة رقم ${tweetId}`);
    navigate("/"); // يمكن التعديل للتوجيه مباشرة للتغريدة
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">البلاغات</h2>
      {reports.map(report => (
        <div key={report.id} className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span>تغريدة رقم {report.tweetId} - السبب: {report.reason}</span>
          <button onClick={() => handleViewTweet(report.tweetId)} className="px-4 py-2 bg-red-500 text-white rounded">عرض التغريدة</button>
        </div>
      ))}
    </div>
  );
}
