const translations = {
  // Required
  "Username is required": "اسم المستخدم مطلوب",
  "Name is required": "الاسم مطلوب",
  "Email is required": "البريد الإلكتروني مطلوب",
  "Password is required": "كلمة المرور مطلوبة",
  "Confirm password is required": "تأكيد كلمة المرور مطلوب",

  // Validation
  "Invalid email": "البريد الإلكتروني غير صالح",
  "Email is not valid": "البريد الإلكتروني غير صالح",
  "Password must be at least 8 characters": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
  "Password must be less than 100 characters": "كلمة المرور يجب أن تكون أقل من 100 حرف",
  "Password confirmation does not match": "تأكيد كلمة المرور غير متطابق",
  "Name must be at least 3 characters": "الاسم يجب أن يكون 3 أحرف على الأقل",
  "Name must be less than 50 characters": "الاسم يجب أن يكون أقل من 50 حرفًا",
  "Username must be at least 3 characters": "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
  "Username must be less than 20 characters": "اسم المستخدم يجب أن يكون أقل من 20 حرفًا",
  "Must be a number": "يجب أن يكون رقمًا",
  "Must be an integer": "يجب أن يكون عددًا صحيحًا",
  "Must be positive": "يجب أن يكون رقمًا موجبًا",
  "Must be greater than 0": "يجب أن يكون أكبر من صفر",
  "Invalid date": "التاريخ غير صالح",
  "Date must be in the future": "التاريخ يجب أن يكون في المستقبل",
  "Date must be in the past": "التاريخ يجب أن يكون في الماضي",

  // Auth
  "This email is already registered": "هذا البريد الإلكتروني مسجّل مسبقًا",
  "Invalid credentials": "بيانات تسجيل الدخول غير صحيحة",
  "User not found": "المستخدم غير موجود",
  "User already exists": "المستخدم موجود بالفعل",
  "Unauthorized": "غير مصرح لك",
  "Forbidden": "ممنوع الوصول",

  // Tokens
  "Invalid token": "رمز التحقق غير صالح",
  "Token expired": "انتهت صلاحية رمز التحقق",
  "No token provided": "لم يتم إرسال رمز التحقق",

  // Server
  "Server error": "خطأ في السيرفر",
  "Internal server error": "حدث خطأ داخلي في السيرفر",
  "Service unavailable": "الخدمة غير متاحة الآن",
  "Not found": "العنصر غير موجود",
  "Item not found": "العنصر غير موجود",

  // Generic
  "Field is required": "الحقل مطلوب",
  "Invalid value": "القيمة غير صالحة",
};

export default function translateServerMessage(msg) {
  return translations[msg] || msg || "حدث خطأ غير متوقع.";
}
