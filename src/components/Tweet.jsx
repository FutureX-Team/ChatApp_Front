// src/components/Tweet.js
import Avatar from "./Avatar";
// ... استيرادات ...

export default function Tweet({ tweet, currentUser }) {
  // ...
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Avatar name={tweet.user.username} />
        </div>
        <div className="flex-1 ml-3">
          <h3 className="font-bold text-sm sm:text-base">{tweet.user.username}</h3>
          <p className="mt-1 text-sm sm:text-base">{tweet.text}</p>
        </div>
      </div>
      {/* الأزرار بحجم أصغر على الجوال */}
      <div className="flex items-center gap-4 sm:gap-6 mt-3 text-gray-500 dark:text-gray-400 ml-12 text-xs sm:text-sm">
        {/* ... أزرار اللايك والديسلايك ... */}
      </div>
      {/* ... */}
    </div>
  );
}
