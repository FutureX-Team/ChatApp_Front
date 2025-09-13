import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { rehydrateAuth } from "../api/api";
import Avatar from "../components/Avatar";
import { Pencil } from "lucide-react";

export default function Settings({ user: userProp, setUser }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [editingCurrentPassword, setEditingCurrentPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let me = userProp;
        if (!me) {
          const { cachedUser } = rehydrateAuth();
          if (cachedUser && typeof cachedUser === "object") me = cachedUser;
        }
        if (!me) {
          const { data } = await api.get("/me");
          me = data?.user ?? data;
        }
        if (!me || typeof me !== "object") throw new Error("No user data");

        setUsername(me.username ?? me.name ?? "");
        setEmail(me.email ?? "");
        setAvatarUrl(me.avatar_url ?? "");
        setDarkMode(!!me.dark_mode);
      } catch (e) {
        console.error("[Settings] load error:", e?.response?.data || e.message);
        navigate("/login");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [userProp, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password && password.trim().length < 8) {
      setErrors({ password: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
      return;
    }
    try {
      const payload = {
        username,
        email,
        avatar_url: avatarUrl === "" ? null : avatarUrl,
        dark_mode: !!darkMode,
        ...(currentPassword?.trim() ? { current_password: currentPassword.trim() } : {}),
        ...(password?.trim() ? { password: password.trim() } : {}),
      };
      const { data } = await api.put("/me", payload);
      const updated = data?.user ?? data;
      localStorage.setItem("user", JSON.stringify(updated));
      typeof setUser === "function" && setUser(updated);
      setPassword("");
      setCurrentPassword("");
      setEditingCurrentPassword(false);
      alert("تم تحديث الملف الشخصي بنجاح ✅");
    } catch (err) {
      console.error("[Settings] save error:", err?.response?.data || err.message);
      const v = err?.response?.data?.errors;
      if (v) {
        const flat = Object.fromEntries(
          Object.entries(v).map(([k, arr]) => [k, Array.isArray(arr) ? arr[0] : String(arr)])
        );
        setErrors(flat);
        alert("تحقق من الحقول المطلوبة.");
      } else {
        alert(err?.response?.data?.message || "تعذّر حفظ التغييرات.");
      }
    }
  };

  // const handleLogoutClick = async () => {
  //   try {
  //     await api.post("/logout");
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setAuthToken(null);
  //     localStorage.removeItem("user");
  //     onLogout && onLogout();
  //     navigate("/login");
  //   }
  // };

  if (loading) return <div className="text-center p-10">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-gray-800 dark:text-white">
          إعدادات الحساب
        </h2>

        {/* صورة الحساب */}
        <div className="flex justify-center items-center gap-4 mb-6 ">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover border "
              onError={(e) => {
                e.currentTarget.src = "";
                setAvatarUrl("");
              }}
            />
          ) : (
            <Avatar className="" name={username || email || "?"} size="h-16 w-16 text-2xl" />
          )}
          {/* <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              رابط الصورة الشخصية (Avatar URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/me.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">اتركه فارغًا لإزالة الصورة.</p>
          </div> */}
        </div>

        {/* اسم المستخدم */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            اسم المستخدم
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            required
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            required
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* كلمة المرور الحالية */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              كلمة المرور الحالية
            </label>
            <button
              type="button"
              onClick={() => setEditingCurrentPassword((prev) => !prev)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={!editingCurrentPassword}
            className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
              ${
                editingCurrentPassword
                  ? "bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  : "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-70"
              }`}
          />
        </div>

        {/* كلمة مرور جديدة */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            كلمة المرور الجديدة
          </label>
          <input
            id="password"
            type="password"
            placeholder="اتركها فارغة إن لم ترغب بالتغيير"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

 

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            حفظ التعديلات
          </button>
      
        </div>
      </form>
    </div>
  );
}