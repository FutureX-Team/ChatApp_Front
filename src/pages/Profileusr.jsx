<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Tweet from "../components/Tweet";
import Avatar from "../components/Avatar";
import { showErrorToast } from "../utils/toast";

export default function Profileusr({ currentUser }) {
  const { username } = useParams(); // نجيب اسم المستخدم من الرابط
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${username}`);
        setUser(res.data.user);
        setTweets(Array.isArray(res.data.tweets) ? res.data.tweets : []);
      } catch (err) {
        showErrorToast(err, "تعذّر جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleDeleteTweet = (tweetId) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
  };

  if (loading) return <p className="text-center mt-10">جارٍ التحميل...</p>;
  if (!user) return <p className="text-center mt-10">المستخدم غير موجود</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={user.username} url={user.avatar_url} />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.bio}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">تغريدات {user.username}</h3>

      {tweets.length === 0 ? (
        <p className="text-gray-500">لا توجد تغريدات بعد.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              currentUser={currentUser}
              onDelete={handleDeleteTweet}
            />
          ))}
        </div>
      )}
    </div>
  );
}
=======
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Tweet from "../components/Tweet";
import Avatar from "../components/Avatar";
import { showErrorToast } from "../utils/toast";

export default function Profileusr({ currentUser }) {
  const { username } = useParams(); // نجيب اسم المستخدم من الرابط
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${username}`);
        setUser(res.data.user);
        setTweets(Array.isArray(res.data.tweets) ? res.data.tweets : []);
      } catch (err) {
        showErrorToast(err, "تعذّر جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleDeleteTweet = (tweetId) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
  };

  if (loading) return <p className="text-center mt-10">جارٍ التحميل...</p>;
  if (!user) return <p className="text-center mt-10">المستخدم غير موجود</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={user.username} url={user.avatar_url} />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.bio}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">تغريدات {user.username}</h3>

      {tweets.length === 0 ? (
        <p className="text-gray-500">لا توجد تغريدات بعد.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              currentUser={currentUser}
              onDelete={handleDeleteTweet}
            />
          ))}
        </div>
      )}
    </div>
  );
}
>>>>>>> master
