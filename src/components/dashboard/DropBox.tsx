import React, { useState } from "react";
import {
  Share2,
  Trash2,
  FolderPlus,
  Copy,
  Pencil,
  LayoutGrid,
  FileSpreadsheet,
  Folder,
  Vault,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const files = [
  { name: "Attachments", modified: "9/13/2017", size: "", type: "folder" },
  { name: "Desktop", modified: "12/29/2020", size: "156 MB", type: "folder" },
  { name: "Documents", modified: "9/13/2017", size: "664 MB", type: "folder" },
  { name: "Keepass", modified: "10/11/2024", size: "1.93 KB", type: "folder" },
  { name: "Other", modified: "10/3/2024", size: "5.70 MB", type: "folder" },
  { name: "Personal", modified: "1/14/2025", size: "646 KB", type: "folder" },
  { name: "Personal Vault", modified: "11/16/2024", size: "696 KB", type: "vault" },
  { name: "Pictures", modified: "1/18/2019", size: "399 MB", type: "folder" },
  { name: "Test", modified: "1/13/2025", size: "521 KB", type: "folder" },
  { name: "DwarkaTripExpectedExpenseDec24.xlsx", modified: "11/1/2024", size: "15.4 KB", type: "file" },
];

export default function DropBox() {
  const [selected, setSelected] = useState<string[]>([]);
  const { theme } = useTheme();

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black"}`}>
      <aside className={`w-64 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-r border-gray-200"} p-4 text-sm`}>
        <div className="font-bold text-lg mb-4">Praveen Sharma</div>
        <nav className={`space-y-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          <div>🏠 Home</div>
          <div className="text-blue-600 font-medium">📁 My files</div>
          <div>🖼 Photos</div>
          <div>👥 Shared</div>
          <div>🗑 Recycle bin</div>
          <div className="text-xs text-gray-500 mt-6">Browse files by</div>
          <div>👤 People</div>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className={`flex-1 flex flex-col overflow-hidden rounded-lg shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          {selected.length > 0 && (
            <div className={`sticky top-0 z-10 p-3 border-b flex justify-between items-center text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}>
              <div className="flex gap-4">
                <button className="flex items-center gap-1 hover:text-blue-400"><Share2 size={16}/> Share</button>
                <button className="flex items-center gap-1 hover:text-red-400"><Trash2 size={16}/> Delete</button>
                <button className="flex items-center gap-1 hover:text-blue-400"><FolderPlus size={16}/> Move</button>
                <button className="flex items-center gap-1 hover:text-blue-400"><Copy size={16}/> Copy</button>
                <button className="flex items-center gap-1 hover:text-blue-400"><Pencil size={16}/> Rename</button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelected([])} className="border border-gray-300 rounded-full px-3 py-1">✕ {selected.length} selected</button>
                <span className="w-px h-6 bg-gray-300"></span>
                <LayoutGrid size={18} className="text-gray-600" />
                <span className="text-gray-700">Details</span>
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1">
            <h2 className="text-xl font-semibold px-4 pt-4 pb-2">My files</h2>
            <table className="w-full text-sm">
              <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Modified</th>
                  <th className="p-2 text-left">File size</th>
                  <th className="p-2 text-left">Sharing</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr
                    key={f.name}
                    className={`border-t ${theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "hover:bg-blue-50"} ${selected.includes(f.name) ? (theme === "dark" ? "bg-gray-600" : "bg-blue-100") : ""}`}
                    onClick={() => toggle(f.name)}
                  >
                    <td className="p-2">
                      <input type="checkbox" checked={selected.includes(f.name)} onChange={() => toggle(f.name)} onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      {f.type === "folder" && <Folder size={16} />}
                      {f.type === "file" && <FileSpreadsheet size={16} />}
                      {f.type === "vault" && <Vault size={16} />}
                      {f.name}
                    </td>
                    <td className="p-2">{f.modified}</td>
                    <td className="p-2">{f.size}</td>
                    <td className="p-2">Private</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
