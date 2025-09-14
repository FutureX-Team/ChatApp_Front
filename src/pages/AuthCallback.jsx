import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";

export default function AuthCallback({ setUser, setIsAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login?error=google", { replace: true });
      return;
    }

    // If opened inside a popup → post token to opener and close.
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "OAUTH_SUCCESS", payload: { token } },
          window.location.origin
        );

        // Safety fallback: if opener didn't handle message in ~300ms, navigate it.
        setTimeout(() => {
          try {
            if (!window.opener.closed) {
              window.opener.location.href =
                `${window.location.origin}/auth/callback?token=${encodeURIComponent(token)}`;
            }
          } catch {}
          window.close();
        }, 300);
        return;
      }
    } catch {}

    // Same-tab fallback: finish login here.
    (async () => {
      setAuthToken(token);
      try {
        const { data: me } = await api.get("/me");
        setUser(me);
        setIsAdmin(me?.role === "admin");
        localStorage.setItem("user", JSON.stringify(me));
        navigate("/", { replace: true });
      } catch {
        setAuthToken(null);
        navigate("/login?error=session", { replace: true });
      }
    })();
  }, [navigate, setUser, setIsAdmin]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">جارٍ تسجيل الدخول باستخدام Google...</p>
    </div>
  );
}
