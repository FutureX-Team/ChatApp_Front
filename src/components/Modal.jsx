import { useState } from "react";
import { X } from "lucide-react";

export default function Modal({ onClose, onSubmit, maxChars = 280, title }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.length === 0 || text.length > maxChars) return;
    onSubmit(text);
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white">{title}</h2>
          <button onClick={onClose}>
            <X className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring resize-none text-black dark:text-white bg-gray-100 dark:bg-gray-700"
          rows="4"
          placeholder="اكتب هنا..."
        />

        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>{text.length}/{maxChars}</span>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
