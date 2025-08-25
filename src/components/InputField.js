function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 border rounded w-full text-right"
    />
  );
}

export default InputField;
