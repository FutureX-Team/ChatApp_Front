// src/pages/Profile.jsx

import Tweet from "../components/Tweet";
import Avatar from "../components/Avatar";

// ✅ 1. استقبال setTweets كـ prop
export default function Profile({ user, tweets, setTweets }) {
  if (!user) return <p className="p-4 text-center">الرجاء تسجيل الدخول لعرض الملف الشخصي.</p>;

  const userTweets = tweets?.filter(t => t.user.name === user.name) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mt-8 mb-8">
        <Avatar name={user.name} size="h-24 w-24 text-4xl" />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      <h3 className="text-xl font-bold mb-4">تغريداتي</h3>
      <div className="space-y-4">
        {userTweets.length > 0 ? (
          userTweets.map(tweet => (
            // ✅ 2. تمرير كل الـ props اللازمة إلى Tweet
            <Tweet 
              key={tweet.id} 
              tweet={tweet} 
              currentUser={user}
              setTweets={setTweets}
              allTweets={tweets}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">لم تقم بالتغريد بعد.</p>
        )}
      </div>
    </div>
  );
}
