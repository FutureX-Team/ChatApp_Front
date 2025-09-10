import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";

export default function AuthCallback({ setUser, setIsAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login?error=google");
        return;
      }

      setAuthToken(token);

      try {
        const { data: me } = await api.get("/me");
        setUser(me);
        setIsAdmin(me?.role === "admin");
        localStorage.setItem("user", JSON.stringify(me));
        navigate("/");
      } catch (e) {
        setAuthToken(null);
        navigate("/login?error=session");
      }
    })();
  }, [navigate, setUser, setIsAdmin]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">جارٍ تسجيل الدخول باستخدام Google...</p>
    </div>
  );
}
