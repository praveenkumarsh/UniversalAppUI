import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./home/Header";
import { AppSelector } from "./helpers/AppSelector";
import Dashboard from "./home/Dashboard";
import { apps } from "./apps.config";

const Home: React.FC = () => {
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ name: string; icon: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Auto-select app based on URL path
  useEffect(() => {
    const path = location.pathname.slice(1); // removes "/"
    const matchedApp = apps.find((app) => app.name.toLowerCase() === path);
    if (matchedApp) {
      setSelectedApp(matchedApp);
    } else if (location.pathname === "/") {
      setSelectedApp(null);
    }
  }, [location.pathname]);

  const handleSelectApp = (app: typeof apps[number]) => {
    setSelectedApp(app);
    setShowAppSelector(false);
    navigate(`/${app.name.toLowerCase()}`);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Header
        onToggleAppSelector={() => setShowAppSelector(!showAppSelector)}
        selectedAppName={`${selectedApp?.icon ?? ""} ${selectedApp?.name ?? "Universal App"}`}
      />
      <AppSelector isOpen={showAppSelector} onSelect={handleSelectApp} />
      <Dashboard selectedApp={selectedApp} />
    </div>
  );
};

export default Home;
