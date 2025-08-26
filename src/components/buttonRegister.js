function ButtonRegister({ onClick }) {
  return (
<button className="bg-blue-900 text-white p-2 rounded hover:bg-blue-500 transition-colors duration-300"
 onClick={ onClick }
 >تسجيل</button>
  );
}

export default ButtonRegister;