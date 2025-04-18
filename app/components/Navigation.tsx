import { useState } from "react";

interface NavigationProps {
  onSelectPage: (page: string) => void;
}

export default function Navigation({ onSelectPage }: NavigationProps) {
  const [activePage, setActivePage] = useState("ShortURL");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePageSelect = (page: string) => {
    setActivePage(page);
    onSelectPage(page);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-900 text-white flex flex-col p-4 transition-all duration-300`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className="mb-4 text-gray-300 hover:text-white focus:outline-none"
      >
        {isCollapsed ? "▶" : "◀"}
      </button>

      {/* Navigation Items */}
      <ul className="space-y-2">
        {["ShortURL", "PasteBin", "DropBox", "Chat"].map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageSelect(page)}
              className={`w-full text-left px-4 py-2 rounded font-medium transition ${
                activePage === page
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              } ${isCollapsed ? "text-center px-0" : ""}`}
            >
              {isCollapsed ? page[0] : page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}