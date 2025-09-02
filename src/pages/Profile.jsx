import Tweet from "../components/Tweet";
import Avatar from "../components/Avatar";

export default function Profile({ user, tweets }) { // لم تعد darkMode prop ضرورية هنا
  // عرض رسالة إذا لم يكن المستخدم مسجلاً دخوله
  if (!user) {
    return <p className="p-4 text-center">الرجاء تسجيل الدخول لعرض الملف الشخصي.</p>;
  }

  // ✅ ---  الحل هنا --- ✅
  // تم تغيير منطق الفلترة ليعتمد على معرّف المستخدم (ID) بدلاً من الاسم
  // هذا يضمن دقة الفلترة بشكل كامل.
  const userTweets = tweets?.filter(tweet => tweet.user?.id === user.id) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mt-8 mb-8">
        {/* استخدام Avatar لعرض الحرف الأول من اسم المستخدم */}
        <Avatar name={user.name} size="h-24 w-24 text-4xl" />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      <h3 className="text-xl font-bold mb-4">تغريداتي</h3>
      <div className="space-y-4">
        {/* التحقق من وجود تغريدات للمستخدم */}
        {userTweets.length > 0 ? (
          userTweets.map(tweet => (
            // تمرير المستخدم الحالي للتغريدة للتحكم في خيارات الإبلاغ وغيرها
            <Tweet key={tweet.id} tweet={tweet} currentUser={user} />
          ))
        ) : (
          // رسالة في حال لم يقم المستخدم بالتغريد بعد
          <p className="text-gray-500 text-center py-8">لم تقم بالتغريد بعد.</p>
        )}
      </div>
    </div>
  );
}
