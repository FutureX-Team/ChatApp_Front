export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button onClick={() => setDarkMode(prev => !prev)}>
      {darkMode ? "🌞" : "🌙"}
    </button>
  );
}
