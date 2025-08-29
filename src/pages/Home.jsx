import { useState } from "react";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

export default function Home({ user }) {
  const [tweets, setTweets] = useState([
    { id: 1, user: { name: "أحمد" }, text: "هذه تغريدة تجريبية أولى! 🚀", up_count: 15, down_count: 1, replies: [] },
    { id: 2, user: { name: "سارة" }, text: "مرحباً بالعالم! تصميم جميل.", up_count: 42, down_count: 0, replies: [] },
  ]);
  const [showModal, setShowModal] = useState(false);

  const addTweet = (text) => {
    if (!text.trim() || !user) return;
    const newTweet = {
      id: Date.now(),
      user: user,
      text: text,
      up_count: 0,
      down_count: 0,
      replies: [],
    };
    setTweets([newTweet, ...tweets]);
    setShowModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {user && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-full shadow-lg z-40"
        >
          <Plus size={28} />
        </button>
      )}

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSubmit={addTweet}
          title="تغريدة جديدة"
        />
      )}

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} currentUser={user} />
        ))}
      </div>
    </div>
  );
}
