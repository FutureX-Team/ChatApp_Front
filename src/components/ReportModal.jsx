import { useState } from "react";
import { X } from "lucide-react";

const reportReasons = [
  "محتوى غير مرغوب فيه (Spam)",
  "محتوى حساس أو مزعج",
  "محتوى عنيف أو بغيض",
  "معلومات مضللة",
  "سبب آخر",
];

export default function ReportModal({ onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState("");

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">الإبلاغ عن التغريدة</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          الرجاء تحديد سبب الإبلاغ. سيساعدنا هذا في مراجعة المحتوى بشكل أسرع.
        </p>

        <div className="space-y-2">
          {reportReasons.map((reason) => (
            <label key={reason} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="report-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800 dark:text-gray-200">{reason}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end items-center mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="bg-red-600 text-white px-5 py-2 rounded-full font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            إرسال البلاغ
          </button>
        </div>
      </div>
    </div>
  );
}
