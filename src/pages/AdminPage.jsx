// src/pages/AdminPage.jsx

import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BarChart2, Trash2 } from "lucide-react";
import api from "../api/api";
// --- مكون عرض البلاغات (مُعدّل) ---
const ReportsTab = ({ deleteTweet }) => {
  const navigate = useNavigate();

  // ⚠️ القيم القادمة من السيرفر بالإنجليزي، نعرض عربي في الواجهة
  const statusLabel = { new: "جديد", reviewing: "تحت المراجعة", resolved: "تمت المعالجة" };
  const statusValue = { "جديد": "new", "تحت المراجعة": "reviewing", "تمت المعالجة": "resolved" };

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusClass = (statusEn) => {
    switch (statusEn) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "reviewing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  // جلب البلاغات من السيرفر
  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/reports"); // Authorization: Bearer <TOKEN> مُضاف من api instance
      // نتوقع { data: [ {id, tweet_id, reason, status, tweet: {...}} ] }
      setReports(Array.isArray(data?.data) ? data.data : data);
    } catch (e) {
      console.error(e);
      alert("تعذّر تحميل البلاغات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatusEn) => {
    // تحديث متفائل
    setReports((prev) => prev.map(r => r.id === reportId ? { ...r, status: newStatusEn } : r));
    try {
      await api.put(`/admin/reports/${reportId}`, { status: newStatusEn });
    } catch (e) {
      console.error(e);
      alert("تعذّر تحديث الحالة");
      // رجوع عن التحديث المتفائل بإعادة الجلب
      fetchReports();
    }
  };

  const handleDeleteTweet = async (report) => {
    if (!window.confirm(`هل أنت متأكد من حذف التغريدة رقم ${report.tweet_id}؟`)) return;
    try {
      await api.delete(`/admin/tweets/${report.tweet_id}`);
      // اختياري: تحدّث واجهة التايملاين من الستايت العامّة:
      if (typeof deleteTweet === "function") deleteTweet(report.tweet_id);

      // علّم البلاغ “تمت المعالجة”
      await handleStatusChange(report.id, "resolved");
      alert("تم حذف التغريدة ومعالجة البلاغ");
    } catch (e) {
      console.error(e);
      alert("تعذّر حذف التغريدة");
    }
  };

  if (loading) return <div className="p-4">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <div key={report.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="flex-grow cursor-pointer"
            onClick={() => navigate(`/tweet/${report.tweet_id}`, { state: { from: 'reports' } })}
          >
            <p className="font-bold text-lg">بلاغ على التغريدة #{report.tweet_id}</p>
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
              <option value="new">{statusLabel.new}</option>
              <option value="reviewing">{statusLabel.reviewing}</option>
              <option value="resolved">{statusLabel.resolved}</option>
            </select>

            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteTweet(report); }}
              className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full"
              title={`حذف التغريدة رقم ${report.tweet_id}`}
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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/dashboard");
        if (!alive) return;
        setStats(data);
      } catch (e) {
        setErr("تعذّر تحميل الإحصائيات");
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-4">جارٍ التحميل...</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;

  // توقعات الحقول القادمة من الباك:
  // users_count, tweets_count, reports_count,
  // registered_tweets, guest_tweets, last_month_tweets, last_week_tweets, online_users
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
      <StatCard title="إجمالي المستخدمين المسجلين" value={stats.users_count} />
      <StatCard title="إجمالي التغريدات" value={stats.tweets_count} />
      <StatCard title="البلاغات" value={stats.reports_count} />
      {"registered_tweets" in stats && <StatCard title="تغريدات المسجلين" value={stats.registered_tweets} />}
      {"guest_tweets" in stats && <StatCard title="تغريدات الزوار" value={stats.guest_tweets} />}
      {"last_week_users" in stats && <StatCard title="المستخدمون الجدد آخر أسبوع" value={stats.last_week_users} /> }
      {"last_week_tweets" in stats && <StatCard title="تغريدات آخر أسبوع" value={stats.last_week_tweets} />}
      {"online_users" in stats && <StatCard title="المستخدمون المتواجدون الآن" value={stats.online_users} color="green" />}
    </div>
  );
};

const StatCard = ({ title, value, color = "blue" }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    {/* ملاحظة Tailwind: لو بتبني production، لا تستخدم نص ديناميكي خالص في الألوان.
       إمّا خريطة ثابتة أو safelist. */}
    <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mt-1`}>
      {Number(value ?? 0).toLocaleString()}
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
