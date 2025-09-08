// src/components/Avatar.js
import { useState } from "react";

const stringToColor = (str) => {
  if (!str) return "#cccccc";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

export default function Avatar({ name, url, size = "h-10 w-10", className = "" }) {
  const [imgErr, setImgErr] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const bgColor = stringToColor(name);

  // لو فيه رابط وما صار خطأ تحميل، اعرض الصورة
  if (url && !imgErr) {
    return (
      <img
        src={url}
        alt={name || "avatar"}
        className={`rounded-full object-cover ${size} ${className}`}
        onError={() => setImgErr(true)} // fallback تلقائي
      />
    );
  }

  // fallback: أفاتار ملوّن بالحرف الأول
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-bold ${size} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name || ""}
    >
      {initial}
    </div>
  );
}
