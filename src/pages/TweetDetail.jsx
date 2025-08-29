// src/pages/TweetDetail.js
import { useParams } from "react-router-dom";
import Tweet from "../components/Tweet";

export default function TweetDetail({ user, tweets }) {
  const { id } = useParams();
  
  // ✅ البحث في التغريدات والردود للعثور على التغريدة المطلوبة
  let tweet = null;
  for (const t of tweets) {
    if (t.id === parseInt(id)) {
      tweet = t;
      break;
    }
    if (t.replies) {
      const reply = t.replies.find(r => r.id === parseInt(id));
      if (reply) {
        tweet = reply;
        break;
      }
    }
  }

  if (!tweet) return <p className="p-4 text-center">التغريدة غير موجودة</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Tweet tweet={tweet} currentUser={user} />
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4">الردود</h3>
        {tweet.replies && tweet.replies.length > 0 ? (
          <div className="space-y-4">
            {tweet.replies.map(reply => (
              <Tweet key={reply.id} tweet={reply} currentUser={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">لا توجد ردود بعد.</p>
        )}
      </div>
    </div>
  );
}
