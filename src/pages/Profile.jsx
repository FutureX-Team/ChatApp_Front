import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import Avatar from "../components/Avatar";
import api, { rehydrateAuth } from "../api/api";
import toast from "react-hot-toast";
import { showErrorToast } from "../utils/toast";

export default function Profile({ user: propUser }) {
  const [user, setUser] = useState(propUser);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // إذا propUser غير موجود، نحاول إعادة التحميل من localStorage
    if (!propUser) {
      const { cachedUser } = rehydrateAuth();
      setUser(cachedUser);
    }
  }, [propUser]);

  useEffect(() => {
    const ac = new AbortController();

    if (!user) {
      setUserTweets([]);
      setLoading(false);
      return () => ac.abort();
    }

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${user.id}/tweets`, {
          signal: ac.signal,
        });
        setUserTweets(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error(e);
          toast.error("تعذّر تحميل تغريدات المستخدم");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [user]);

  if (!user) {
    return (
      <p className="p-4 text-center text-red-600">
        الرجاء تسجيل الدخول لعرض الملف الشخصي.
      </p>
    );
  }

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه التغريدة؟")) return;
    try {
      await api.delete(`/tweets/${tweetId}`);
      setUserTweets((prev) => prev.filter((tw) => tw.id !== tweetId));
      toast.success("تم حذف التغريدة بنجاح ✅");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف التغريدة ❌");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mt-8 mb-8">
        <Avatar
          name={user.username}
          url={user.avatar_url}
          size="h-24 w-24 text-4xl"
        />
        <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      <h3 className="text-xl font-bold mb-4">
        تغريداتي ({userTweets.length})
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">جاري التحميل…</p>
      ) : (
        <div className="space-y-4">
          {userTweets.length > 0 ? (
            userTweets.map((t) => (
              <Tweet
                key={t.id}
                tweet={t}
                currentUser={user}
                onDelete={() => handleDeleteTweet(t.id)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">لم تقم بالتغريد بعد.</p>
          )}
        </div>
      )}
    </div>
  );
}
