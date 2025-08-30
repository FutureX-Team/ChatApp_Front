import { useState } from "react";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";

export default function Home({ user, tweets, setTweets }) {
  const [showModal, setShowModal] = useState(false);

  const addTweet = (text) => {
    if (!text.trim()) return;

    // ✅ تحديد هوية المستخدم أو الزائر
    const author = user ? user : { name: "زائر" };

    const newTweet = {
      id: Date.now(),
      user: author,
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
      {/* ✅ إظهار الزر للجميع */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-full shadow-lg z-40"
        title="إضافة تغريدة جديدة"
      >
        <Plus size={28} />
      </button>

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
