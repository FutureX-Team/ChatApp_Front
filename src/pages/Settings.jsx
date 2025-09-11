import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { rehydrateAuth, setAuthToken } from "../api/api";
import Avatar from "../components/Avatar";
import { Pencil } from "lucide-react";
import { showErrorToast } from "../utils/toast";
import toast from "react-hot-toast"; // ✨ أضفه هنا


export default function Settings({ user: userProp, onLogout, setUser, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [editingCurrentPassword, setEditingCurrentPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let me = userProp ?? rehydrateAuth().cachedUser;
        if (!me) {
          const { data } = await api.get("/me");
          me = data?.user ?? data;
        }
        if (!me) throw new Error("لا توجد بيانات المستخدم");

        setUsername(me.username ?? me.name ?? "");
        setEmail(me.email ?? "");
        setAvatarUrl(me.avatar_url ?? "");
        setDarkMode(!!me.dark_mode);
      } catch (err) {
        showErrorToast(err, "تعذّر تحميل بيانات المستخدم.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [userProp, navigate, setDarkMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password && password.length < 8) {
      setErrors({ password: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
      return;
    }

    try {
      const payload = { username, email, avatar_url: avatarUrl || null, dark_mode: darkMode };
      if (currentPassword) payload.current_password = currentPassword;
      if (password) payload.password = password;

      const { data } = await api.put("/me", payload);
      const updated = data?.user ?? data;
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setPassword(""); setCurrentPassword(""); setEditingCurrentPassword(false);
      toast.success("تم تحديث الملف الشخصي بنجاح ✅");
    } catch (err) {
      showErrorToast(err, "تعذّر حفظ التغييرات.");
    }
  };

  const handleLogoutClick = async () => {
    try { await api.post("/logout"); } catch (e) { console.error(e); }
    setAuthToken(null);
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/login");
  };

  if (loading) return <div className="text-center p-10">جاري تحميل الإعدادات...</div>;

  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-gray-800 dark:text-white">إعدادات الحساب</h2>
      {/* باقي الحقول مثل الاسم والبريد والوضع الليلي وكلمة المرور */}
      <button type="submit" className="btn-primary w-full">حفظ التعديلات</button>
      <button type="button" onClick={handleLogoutClick} className="btn-red w-full mt-2">تسجيل الخروج</button>
    </form>
  );
}
