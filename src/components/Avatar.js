const stringToColor = (str) => {
  if (!str) return '#cccccc';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export default function Avatar({ name, size = "h-10 w-10" }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = stringToColor(name);

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-bold ${size}`}
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
}
