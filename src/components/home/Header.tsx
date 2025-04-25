import { useTheme } from "../../context/ThemeContext"; // Custom hook to access theme context
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react"; // Icon for dark/light mode toggle
import { Menu } from "@headlessui/react";

interface HeaderProps {
  onToggleAppSelector: () => void;
  selectedAppName: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAppSelector, selectedAppName }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
        {/* <button
          onClick={() => {
            console.log("Button clicked");
            toggleTheme}
          }
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button> */}
        {/* <button className="hover:text-blue-500">🔍</button>
        <button className="hover:text-blue-500">⚙️</button> */}
        {/* <button className="hover:text-blue-500">❓</button> */}
        {/* <div className="w-8 h-8 rounded-full bg-gray-300" /> */}
        <button className="hover:text-blue-500 text-gray-600 dark:text-gray-300">❓</button>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="w-8 h-8 rounded-full bg-gray-300 hover:ring-2 ring-blue-500 dark:bg-gray-700" />

          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/dashboard/profile")}
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    Update Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    } w-full text-left px-4 py-2 text-sm text-red-600`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
};
