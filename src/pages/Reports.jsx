import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reports({ user, isAdmin }) {
  const navigate = useNavigate();

  // ✅ إضافة حالة لكل بلاغ
  const [reports, setReports] = useState([
    { id: 1, tweetId: 2, reason: "إساءة", status: "بلاغ جديد" },
    { id: 2, tweetId: 1, reason: "محتوى غير مناسب", status: "تحت المراجعة" },
  ]);

  if (!user || !isAdmin) {
    navigate("/"); // ✅ توجيه المستخدم إذا لم يكن أدمن
    return null;
  }

  const handleStatusChange = (reportId, newStatus) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    // هنا يمكنك إضافة كود لتحديث الحالة في قاعدة البيانات
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "بلاغ جديد": return "bg-blue-500";
      case "تحت المراجعة": return "bg-yellow-500";
      case "تمت المعالجة": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">إدارة البلاغات</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="w-full bg-gray-200 dark:bg-gray-700 text-left">
              <th className="p-3">رقم البلاغ</th>
              <th className="p-3">رقم التغريدة</th>
              <th className="p-3">السبب</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-3">{report.id}</td>
                <td className="p-3">{report.tweetId}</td>
                <td className="p-3">{report.reason}</td>
                <td className="p-3">
                  {/* ✅ قائمة منسدلة لتغيير الحالة */}
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    className={`p-2 rounded text-white ${getStatusColor(report.status)}`}
                  >
                    <option value="بلاغ جديد">بلاغ جديد</option>
                    <option value="تحت المراجعة">تحت المراجعة</option>
                    <option value="تمت المعالجة">تمت المعالجة</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => navigate(`/tweet/${report.tweetId}`)} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                    عرض التغريدة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
