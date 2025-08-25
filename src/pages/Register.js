import { useState } from "react";
import InputField from "../components/InputField"
import ButtonLogin from "../components/Buttonlogin"



function Register() {
  const [username, setUsername] = useState("");
  const [password_hash, setPassword_hash] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 h-80 flex items-center justify-center flex-col mx-auto">
      <h1 className="text-xl font-bold mb-4">تسجيل الدخول</h1>
      <form className="flex flex-col gap-3">

        <InputField
          type="username"
          placeholder="الأسم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="كلمة المرور"
          value={password_hash}
          onChange={(e) => setPassword_hash(e.target.value)}
        />
    <ButtonLogin />
      </form>
    </div>
  );
}

export default Register;
