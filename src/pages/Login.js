import { useState } from "react";
import InputField from "../components/InputField"
import ButtonLogin from "../components/Buttonlogin"
import ButtonRegister from "../components/buttonRegister"
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 h-80 flex items-center justify-center flex-col mx-auto">
      <h1 className="text-xl font-bold mb-4">تسجيل الدخول</h1>
      <form className="flex flex-col gap-3">
        <InputField
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         < ButtonLogin />
         <ButtonRegister onClick={() => navigate("/register")} />
        
    
      </form>
       
    </div>
  );
}

export default Login;
