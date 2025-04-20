import { useTheme } from "../../context/ThemeContext"; // Custom hook to access theme context
import { Sun, Moon } from "lucide-react"; // Icon for dark/light mode toggle

interface HeaderProps {
  onToggleAppSelector: () => void;
  selectedAppName: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAppSelector, selectedAppName }) => {
  const { theme, toggleTheme } = useTheme();
  console.log("Selected App Name:", selectedAppName);
  console.log("theme from context:", theme);

  return (
    <header className="flex items-center justify-between px-4 py-2 shadow bg-white">
      <div className="flex items-center gap-2">
        <button onClick={onToggleAppSelector} className="p-2 hover:bg-gray-200 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-600"
          >
            <circle cx="4" cy="4" r="2" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="20" cy="4" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="4" cy="20" r="2" />
            <circle cx="12" cy="20" r="2" />
            <circle cx="20" cy="20" r="2" />
          </svg>
        </button>
        <span className="text-lg font-semibold">
          {typeof selectedAppName === "string" && selectedAppName.trim() !== ""
            ? selectedAppName
            : "Universal App"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            console.log("Button clicked");
            toggleTheme}
          }
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button className="hover:text-blue-500">🔍</button>
        <button className="hover:text-blue-500">⚙️</button>
        <button className="hover:text-blue-500">❓</button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
};
