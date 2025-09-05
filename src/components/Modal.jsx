import { useState } from "react";
import { X } from "lucide-react";

export default function Modal({ onClose, onSubmit, maxChars = 280, title }) {
  const PLACE_IDS = {
  public: 14,           // عام = بدون مكان
      // ← بدّل بالأرقام الصحيحة عندك
  main_building: 1,
  computer_college: 2,
  engineering_college: 3,
  sharia_college: 4,
  administration_college: 5,
  medical_college: 6,
  sciences_college: 7,
  architecture_college: 8,
  agriculture_college: 9,
  education_college: 10,
  languages_college: 11,
  applied_college: 12,
};
  const [text, setText] = useState("");
  const [location, setLocation] = useState("public");          // ⬅️ المكان المختار
  // const [customLocation, setCustomLocation] = useState("");    // ⬅️ مكان يكتبه المستخدم

  // const remainingChars = maxChars - text.length;
  //  const handleSubmit = () => {
  //    const place_id = location === "custom_location" ? null : PLACE_IDS[location] ?? null;
  //    const location_name = location === "custom_location" ? customLocation.trim() : null;
  //   onSubmit({ text, place_id, location: location_name }); // ⬅️ يرسل النص مع المكان
  // };
   
  const remainingChars = maxChars - text.length;
   const handleSubmit = () => {
     const place_id = location === "custom_location" ? null : PLACE_IDS[location] ?? null;
     
    onSubmit({ text, place_id }); // ⬅️ يرسل النص مع المكان
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          rows="5"
          placeholder="ماذا يحدث؟"
          autoFocus
        />

        <div className="flex flex-col gap-3 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <label htmlFor="location-list">اختر مكان التغريدة:</label>
            <select
              id="location-list"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded p-1"
            >
              <option value="public">عام</option>
              <option value="main_building">المبنى الرئيسي</option>
              <option value="computer_college">كلية الحاسب</option>
              <option value="engineering_college">كلية الهندسة</option>
              <option value="sharia_college">كلية الشريعة</option>
              <option value="administration_college">كلية الادارة والاقتصاد</option>
              <option value="medical_college">الكليات الطبية</option>
              <option value="sciences_college">كلية العلوم</option>
              <option value="architecture_college">كلية العمارة والتخطيط</option>
              <option value="agriculture_college">كلية الزراعة والأغذية</option>
              <option value="education_college">كلية التربية</option>
              <option value="languages_college">كلية اللغات والعلوم الإنسانية</option>
              <option value="applied_college">الكلية التطبيقية</option>
              {/* <option value="custom_location">مكان آخر...</option> */}
            </select>
          </div>

          {/* {location === "custom_location" && (
            <input
              type="text"
              placeholder="اكتب موقعك"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="border rounded p-2 w-full"
            />
          )} */}

          <div className="flex justify-between items-center">
            <span
              className={`font-mono ${
                remainingChars < 20 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {remainingChars}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="bg-blue-500 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              تغريد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
