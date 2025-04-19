// components/AppSelector.tsx
import React from "react";
import { apps } from "../apps.config";

interface AppSelectorProps {
  isOpen: boolean;
  onSelect: (app: typeof apps[number]) => void;
}

export const AppSelector: React.FC<AppSelectorProps> = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-14 left-4 w-72 p-4 bg-white shadow-xl rounded grid grid-cols-2 gap-4 z-50">
      {apps.map((app) => (
        <div
          key={app.name}
          className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => onSelect(app)}
        >
          <div className="text-2xl">{app.icon}</div>
          <span className="text-sm mt-1 text-center">{app.name}</span>
        </div>
      ))}
    </div>
  );
};