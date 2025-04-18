import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ShortURL from "../components/ShortURL";
import PasteBin from "../components/PasteBin";
import DropBox from "../components/DropBox";
import Chat from "../components/Chat";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState("ShortURL");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const renderContent = () => {
    switch (selectedPage) {
      case "ShortURL":
        return <ShortURL />;
      case "PasteBin":
        return <PasteBin />;
      case "DropBox":
        return <DropBox />;
        case "Chat":
          return <Chat />;
      default:
        return <div>Select a page from the navigation menu.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {!isFullscreen && <Header />}

      <div className={`flex ${isFullscreen ? "flex-1" : "flex-1 flex-row"}`}>
        {!isFullscreen && <Navigation onSelectPage={setSelectedPage} />}

        {/* Main Content Area */}
        <main className="p-4 flex-1 relative">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? "❎" : "⛶"}
          </button>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}