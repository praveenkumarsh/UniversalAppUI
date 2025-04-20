import React from "react";
import ShortURL from "../dashboard/ShortURL";
import DropBox from "../dashboard/DropBox";
import Chat from "../dashboard/Chat";
import PasteBin from "../dashboard/PasteBin";

type Props = {
  selectedApp: { name: string; icon: string } | null;
};

const Dashboard: React.FC<Props> = ({ selectedApp }) => {
  console.log("Selected App:", selectedApp);
  const renderAppComponent = () => {
    switch (selectedApp?.name) {
      case "Dropbox":
        return <DropBox />;
      case "Chat":
        return <Chat />;
      case "PasteBin":
        console.log("PasteBin component rendered");
        return <PasteBin />;
      case "ShortURL":
        return <ShortURL />;
      default:
        return (
          <div className="p-6 text-gray-500 text-center">
            Select an app to get started
          </div>
        );
    }
  };

  return <div className="mt-6">{renderAppComponent()}</div>;
};

export default Dashboard;
