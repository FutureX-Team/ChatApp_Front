import api from "./api";
import toast from "react-hot-toast";
import translateServerMessage from "../utils/translateServerMessage";

api.interceptors.response.use(
  (response) => response, // لو مافي خطأ يرجع طبيعي
  (error) => {
    if (error.response?.data?.message) {
      toast.error(translateServerMessage(error.response.data.message));
    } else if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors)
        .map((msg) => `⚠ ${translateServerMessage(msg)}`)
        .join(" | ");
      toast.error(`الحقول غير صحيحة: ${errorMessages}`);
    } else {
      toast.error("حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
    return Promise.reject(error);
  }
);
