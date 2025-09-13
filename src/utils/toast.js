// src/utils/toast.js
import { toast } from "react-hot-toast";

export function showErrorToast(err, fallbackMessage = "حدث خطأ غير متوقع") {
  console.error(err);

  const msg =
    err?.response?.data?.message || 
    (err?.response?.data?.errors 
      ? Object.values(err.response.data.errors).flat().join(" | ") 
      : null) || 
    err?.message || 
    fallbackMessage;

  toast.error(msg);
}
