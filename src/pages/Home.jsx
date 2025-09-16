import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import api from "../api/api";
import React from 'react';
import toast from "react-hot-toast";


import { Fragment } from 'react';



const normalize = (res) =>
  Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data);

export default function Home({ user, tweets, setTweets }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  // ✅ أماكن ككائنات + معرف المكان المحدد
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("14"); // معرف المكان الافتراضي

  useEffect(() => {
  if (localStorage.getItem("tweetAdded")) {
    toast.success("تم إرسال المنشور بنجاح ✅");
    localStorage.removeItem("tweetAdded");
  }
}, []);
useEffect(() => {
  if (localStorage.getItem("tweetDeleted")) {
    toast.success("تم حذف التغريدة بنجاح 🗑️");
    localStorage.removeItem("tweetDeleted");
  }
}, []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setError("");
        setLoading(true);

        if (!places.length) {
          const re = await api.get("/places");
          const list = Array.isArray(re.data) ? re.data : (re.data?.data ?? []);
          setPlaces(list);
        }
        if (selectedPlaceId === "default") {
          setSelectedPlaceId("14"); // معرف المكان الافتراضي (عام)
        }
        const res = await api.get("/tweets/filter", {
          signal: ac.signal,
          params: { place_id: selectedPlaceId || undefined }, // undefined يحذف البارام لو "الجميع"
        });
        const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setTweets(list);
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error(e);
          setError("تعذر تحميل التغريدات.");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [selectedPlaceId, setTweets, places.length]);

  const addTweet = useCallback(
    async (payload) => {
      let text, place_id, location;

      if (typeof payload === "string") {
        text = payload;
      } else if (payload && typeof payload === "object") {
        ({ text, place_id, location } = payload);
      }

      text = (text ?? "").toString();
      if (!text.trim()) return;

      // ✅ استخدم selectedPlaceId إذا لم يُمرَّر place_id من المودال
      place_id = place_id ?? selectedPlaceId;

      try {
        const res = await api.post("/tweets", { text, place_id, location });
        let created = normalize(res);

        if (!created.user && created?.id) {
          const full = await api.get(`/tweets/${created.id}`);
          created = normalize(full);
        }

localStorage.setItem("tweetAdded", "true");
window.location.reload();

      } catch (e) {
        if (e?.response?.status === 401 || e?.response?.status === 419) {
          toast.error("يلزم تسجيل الدخول لنشر تغريدة.");

          navigate("/login");
          return;
        }
        console.error(e);
        toast.error("فشل نشر التغريدة.");
      }
    },
    [setTweets, navigate, selectedPlaceId]
  );

  return (
    <div className="max-w-2xl mx-auto">
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

      <div className="text-center text-2xl font-bold mb-6 mt-4">
        <div className="flex flex-col gap-3 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <label htmlFor="place-list">اختر مكان التغريدة:</label>
            <select
              id="place-list"
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="default">عام</option>
              {places.map((p) => {
                if (p.id === 14) return null; // تخطي "عام" لأنه معرف افتراضي
                return (
                  <option key={p.id} value={p.id}>
                    {p.location_name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="py-8 text-center">جاري تحميل التغريدات...</div>}
      {error && !loading && (
        <div className="py-4 text-center text-red-600">{error}</div>
      )}

      {!loading && (
        <div className="space-y-4">
          {(tweets ?? []).map((t, i) => (
            <Fragment
              key={
                t.id ??
                `${t.user_id ?? t.guest_id ?? "unknown"}-${t.created_at ?? i}-${i}`
              }
            >
              <Tweet
                tweet={t}
                currentUser={user}
                onReply={() =>
                  navigate(`/tweet/${t.id}`, { state: { openReply: true } })
                }
              />
              
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
