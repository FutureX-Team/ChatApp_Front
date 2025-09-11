import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BarChart2, Trash2, Headphones } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/api";
import translateServerMessage from "../utils/translateServerMessage";
import { showErrorToast } from "../utils/toast";

const normalize = (res) =>
  Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data);

const STATUS_LABEL = {
  pending: "جديد",
  reviewed: "تحت المراجعة",
  resolved: "تمت المعالجة",
};

const STATUS_CLASS = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reviewed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const ReportsTab = ({ deleteTweet }) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async (signal) => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports", { signal });
      const list = normalize(res).map((r) => ({
        id: r.id ?? r.report_id ?? r.rid,
        tweet_id: r.tweet_id ?? r.tid ?? r.tweet?.id,
        reason: r.reason ?? r.text ?? "",
        status: ["pending", "reviewed", "resolved"].includes(r.status)
          ? r.status
          : "pending",
      }));
      setReports(list);
    } catch (e) {
      if (e.name !== "CanceledError") {
        toast.error("تعذّر تحميل البلاغات");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchReports(ac.signal);
    return () => ac.abort();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    const prev = reports.find((r) => r.id === reportId)?.status;
    setReports((ps) =>
      ps.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    try {
      await api.put(`/admin/reports/${reportId}`, { status: newStatus });
      toast.success("تم تحديث حالة البلاغ بنجاح ✅");
    } catch (err) {
      toast.error(translateServerMessage(err.response?.data?.message) || "تعذّر تحديث الحالة");
      setReports((ps) =>
        ps.map((r) => (r.id === reportId ? { ...r, status: prev } : r))
      );
    }
  };

  const handleDeleteTweet = async (report) => {
    if (!window.confirm(`هل أنت متأكد من حذف التغريدة رقم ${report.tweet_id}?`))
      return;
    try {
      await api.delete(`/admin/tweets/${report.tweet_id}`);
      deleteTweet?.(report.tweet_id);
      await handleStatusChange(report.id, "resolved");
      toast.success("تم حذف التغريدة ومعالجة البلاغ ✅");
    } catch (err) {
      toast.error(translateServerMessage(err.response?.data?.message) || "تعذّر حذف التغريدة");
    }
  };

  if (loading) return <div className="p-4">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      {reports.length === 0 && <div className="p-4">لا توجد بلاغات حالياً</div>}
      {reports.map((report) => (
        <div
          key={`${report.id}-${report.tweet_id}`}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div
            className="flex-grow cursor-pointer"
            onClick={() =>
              navigate(`/tweet/${report.tweet_id}`, {
                state: { from: "reports" },
              })
            }
          >
            <p className="font-bold text-lg">
              بلاغ على التغريدة #{report.tweet_id}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              السبب: {report.reason}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={report.status}
              onChange={(e) => handleStatusChange(report.id, e.target.value)}
              className={`text-xs font-bold rounded-full border-none focus:ring-2 focus:ring-blue-500 p-1 ${STATUS_CLASS[report.status]}`}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="pending">{STATUS_LABEL.pending}</option>
              <option value="reviewed">{STATUS_LABEL.reviewed}</option>
              <option value="resolved">{STATUS_LABEL.resolved}</option>
            </select>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTweet(report);
              }}
              className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SupportRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get("/admin/support", {
          signal: ac.signal,
        });
        setRequests(normalize(res));
      } catch (e) {
        if (e.name !== "CanceledError") {
          toast.error("تعذّر تحميل طلبات الدعم");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  if (loading) return <div className="p-4">جارٍ التحميل...</div>;

  return (
    <div className="space-y-4">
      {requests.length === 0 && <div className="p-4">لا توجد طلبات دعم حالياً</div>}
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <p className="font-bold text-sm mb-1">الاسم: {req.username}</p>
          {req.email && <p className="text-sm mb-1">البريد: {req.email}</p>}
          <p className="text-sm mb-1">الرسالة: {req.message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            تاريخ الإرسال: {new Date(req.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, color = "blue" }) => {
  const colorMap = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p
        className={`text-3xl font-bold mt-1 ${colorMap[color]}`}
      >
        {Number(value ?? 0).toLocaleString()}
      </p>
    </div>
  );
};

const StatisticsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get("/admin/dashboard", { signal: ac.signal });
        setStats(normalize(res));
      } catch (e) {
        if (e.name !== "CanceledError") {
          setErr("تعذّر تحميل الإحصائيات");
          toast.error("تعذّر تحميل الإحصائيات");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  if (loading) return <div className="p-4">جارٍ التحميل...</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {"users_count" in stats && (
        <StatCard title="إجمالي المستخدمين المسجلين" value={stats.users_count} />
      )}
      {"tweets_count" in stats && (
        <StatCard title="إجمالي التغريدات" value={stats.tweets_count} />
      )}
      {"reports_count" in stats && (
        <StatCard title="البلاغات" value={stats.reports_count} color="red" />
      )}
      {"registered_tweets" in stats && (
        <StatCard title="تغريدات المسجلين" value={stats.registered_tweets} />
      )}
      {"guest_tweets" in stats && (
        <StatCard title="تغريدات الزوار" value={stats.guest_tweets} />
      )}
      {"last_week_users" in stats && (
        <StatCard title="المستخدمون الجدد آخر أسبوع" value={stats.last_week_users} />
      )}
      {"last_week_tweets" in stats && (
        <StatCard title="تغريدات آخر أسبوع" value={stats.last_week_tweets} />
      )}
      {"online_users" in stats && (
        <StatCard
          title="المستخدمون المتواجدون الآن"
          value={stats.online_users}
          color="green"
        />
      )}
    </div>
  );
};

export default function AdminPage({ user, isAdmin, deleteTweet }) {
  const [activeTab, setActiveTab] = useState("reports");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم المدير</h1>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold ${
            activeTab === "reports"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <Shield size={18} />
          البلاغات
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold ${
            activeTab === "stats"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <BarChart2 size={18} />
          الإحصائيات
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold ${
            activeTab === "support"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <Headphones size={18} />
          الدعم الفني
        </button>
      </div>

      <div>
        {activeTab === "reports" && <ReportsTab deleteTweet={deleteTweet} />}
        {activeTab === "stats" && <StatisticsTab />}
        {activeTab === "support" && <SupportRequestsTab />}
      </div>
    </div>
  );
}
