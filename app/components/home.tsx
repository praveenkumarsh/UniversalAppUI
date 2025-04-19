import React, { useState } from "react";
import { Header } from "./home/Header";
import { AppSelector } from "./helpers/AppSelector";
import Dashboard from "./home/Dashboard";

const Home: React.FC = () => {
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ name: string; icon: string } | null>(null);

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Header
        onToggleAppSelector={() => setShowAppSelector(!showAppSelector)}
        selectedAppName={`${selectedApp?.icon ?? ""} ${selectedApp?.name ?? "Universal App"}`}
      />
      <AppSelector
        isOpen={showAppSelector}
        onSelect={(app) => {
          setSelectedApp(app);
          setShowAppSelector(false);
        }}
      />
      <Dashboard selectedApp={selectedApp} />
    </div>
  );
};

export default Home;
