// src/components/Avatar.js

// دالة لتوليد لون عشوائي بناءً على النص (لضمان ثبات اللون لنفس المستخدم)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export default function Avatar({ name, size = "h-10 w-10" }) {
  if (!name) {
    // في حال عدم وجود اسم، يمكن عرض أيقونة افتراضية
    return <div className={`${size} rounded-full bg-gray-400`} />;
  }

  const initial = name.charAt(0).toUpperCase();
  const bgColor = stringToColor(name);

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-bold ${size}`}
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
}
