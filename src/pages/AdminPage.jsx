// src/pages/AdminPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BarChart2, Trash2 } from "lucide-react";

// --- مكون عرض البلاغات (مُعدّل) ---
const ReportsTab = ({ deleteTweet }) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([
    { id: 1, tweetId: 2, reason: "محتوى غير لائق", status: "جديد" },
    { id: 2, tweetId: 1, reason: "إساءة", status: "تحت المراجعة" },
    { id: 3, tweetId: 3, reason: "معلومات مضللة", status: "تمت المعالجة" },
  ]);

  const handleStatusChange = (reportId, newStatus) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "جديد": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "تحت المراجعة": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "تمت المعالجة": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <div key={report.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center gap-4">
          {/* ✅ --- التعديل هنا --- ✅ */}
          <div 
            className="flex-grow cursor-pointer" 
            // عند الضغط، ننتقل إلى الرابط مع إرسال حالة إضافية
            onClick={() => navigate(`/tweet/${report.tweetId}`, { state: { from: 'reports' } })}
          >
            <p className="font-bold text-lg">
              بلاغ على التغريدة #{report.tweetId}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              السبب: {report.reason}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={report.status}
              onChange={(e) => handleStatusChange(report.id, e.target.value)}
              className={`text-xs font-bold rounded-full border-none focus:ring-2 focus:ring-blue-500 ${getStatusClass(report.status)}`}
              onClick={(e) => e.stopPropagation()} 
            >
              <option value="جديد">جديد</option>
              <option value="تحت المراجعة">تحت المراجعة</option>
              <option value="تمت المعالجة">تمت المعالجة</option>
            </select>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`هل أنت متأكد من حذف التغريدة رقم ${report.tweetId}؟`)) {
                  deleteTweet(report.tweetId);
                  handleStatusChange(report.id, "تمت المعالجة");
                }
              }}
              className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full"
              title={`حذف التغريدة رقم ${report.tweetId}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- بقية المكونات تبقى كما هي ---

const StatisticsTab = () => {
  const stats = {
    totalUsers: 1250,
    totalVisitors: 8340,
    registeredTweets: 5430,
    guestTweets: 1280,
    lastMonthTweets: 1800,
    lastWeekTweets: 450,
    onlineUsers: 78,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="إجمالي المستخدمين المسجلين" value={stats.totalUsers} />
      <StatCard title="إجمالي الزوار" value={stats.totalVisitors} />
      <StatCard title="المستخدمون المتواجدون الآن" value={stats.onlineUsers} color="green" />
      <StatCard title="تغريدات المسجلين" value={stats.registeredTweets} />
      <StatCard title="تغريدات الزوار" value={stats.guestTweets} />
      <StatCard title="تغريدات آخر شهر" value={stats.lastMonthTweets} />
      <StatCard title="تغريدات آخر أسبوع" value={stats.lastWeekTweets} />
    </div>
  );
};

const StatCard = ({ title, value, color = "blue" }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mt-1`}>
      {value.toLocaleString()}
    </p>
  </div>
);

export default function AdminPage({ user, isAdmin, deleteTweet }) {
  const [activeTab, setActiveTab] = useState("reports");
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم المدير</h1>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
        >
          <Shield size={18} />
          البلاغات
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
        >
          <BarChart2 size={18} />
          الإحصائيات
        </button>
      </div>

      <div>
        {activeTab === 'reports' && <ReportsTab deleteTweet={deleteTweet} />}
        {activeTab === 'stats' && <StatisticsTab />}
      </div>
    </div>
  );
}
