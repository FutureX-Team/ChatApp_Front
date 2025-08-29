// src/pages/Home.js
import { useEffect, useState } from "react";
import api from '../api/api';

import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

export default function Home({ user, tweets, setTweets }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/tweets')
      .then(response => {
        setTweets(response.data);
      })
      .catch(error => console.error("Failed to fetch tweets", error))
      .finally(() => setLoading(false));
  }, [setTweets]);

  const addTweet = async (text) => {
    try {
      const response = await api.post('/tweets', { text });
      setTweets([response.data.tweet, ...tweets]); // إضافة التغريدة الجديدة في الأعلى
      setShowModal(false);
    } catch (error) {
      console.error("Failed to post tweet", error);
      alert("فشل نشر التغريدة.");
    }
  };

  if (loading) return <div className="text-center mt-10">جاري تحميل التغريدات...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {user && (
        <button onClick={() => setShowModal(true)} className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
          <Plus size={28} />
        </button>
      )}
      {showModal && <Modal onClose={() => setShowModal(false)} onSubmit={addTweet} title="تغريدة جديدة" />}
      
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} currentUser={user} />
        ))}
      </div>
    </div>
  );
}
