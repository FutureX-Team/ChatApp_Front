import { useState } from "react";
import { X } from "lucide-react";

export default function Modal({ onClose, onSubmit, maxChars = 280, title }) {
  const [text, setText] = useState("");
  const remainingChars = maxChars - text.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
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
        <div className="flex justify-between items-center mt-3 text-sm">
          <span className={`font-mono ${remainingChars < 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {remainingChars}
          </span>
          <button
            onClick={() => onSubmit(text)}
            disabled={!text.trim()}
            className="bg-blue-500 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
          >
            تغريد
          </button>
        </div>
      </div>
    </div>
  );
}
