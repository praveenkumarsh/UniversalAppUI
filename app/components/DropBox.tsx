import { useState } from "react";
import { Upload, FolderPlus, AppWindow, Share2, Trash, Download, MoreVertical } from "lucide-react";

export default function DropBox() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const files = [
    { name: "Cube ACR", type: "folder", date: "--" },
    { name: "Dataset", type: "folder", date: "--" },
    { name: "Important Documents", type: "folder", date: "--" },
    { name: "Get Started with Dropbox Paper.url", type: "file", date: "3/2/2018 3:23 pm" },
    { name: "Get Started with Dropbox.pdf", type: "pdf", date: "3/2/2018 3:23 pm" },
    { name: "nomachine_6.7.6 (1).exe", type: "exe", date: "23/7/2019 4:58 pm" },
    { name: "rc164.7z", type: "archive", date: "23/7/2019 5:00 pm" },
    { name: "sample", type: "file", date: "23/7/2019 4:46 pm" }
  ];

  const toggleSelect = (name: string) => {
    setSelectedFiles((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4 border-b border-gray-700 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search"
            className="bg-gray-900 text-white px-4 py-2 rounded-md w-64 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-4 mt-2 flex-wrap">
          <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold">Upload or drop</button>
          <button className="bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 text-sm"><FolderPlus size={16} /> Create folder</button>
          {/* <button className="bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 text-sm"><AppWindow size={16} /> Get the app</button> */}
          {/* <button className="bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 text-sm"><Share2 size={16} /> Share</button> */}
        </div>
        {/* <p className="text-sm text-gray-400 mt-2">Suggested for you 👁</p> */}
      </header>

      {/* File Actions */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700 text-sm">
        <button className="bg-white text-black px-3 py-1 rounded-md">Share selected</button>
        <button className="bg-gray-800 px-3 py-1 rounded-md flex items-center gap-1"><Download size={14} /> Download</button>
        <button className="bg-gray-800 px-3 py-1 rounded-md flex items-center gap-1"><Trash size={14} /> Delete</button>
        {/* <button className="bg-gray-800 px-3 py-1 rounded-md">Open In</button> */}
        {/* <button className="bg-gray-800 px-3 py-1 rounded-md">Send for review</button> */}
        <button className="bg-gray-800 px-2 py-1 rounded-md"><MoreVertical size={14} /></button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">All files</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Name</th>
                <th>Who can access</th>
                <th>Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.name}
                  className={`border-b border-gray-800 hover:bg-gray-800 ${
                    selectedFiles.includes(file.name) ? "bg-emerald-700/20" : ""
                  }`}
                  onClick={() => toggleSelect(file.name)}
                >
                  <td className="py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => toggleSelect(file.name)}
                      className="mr-2"
                    />
                    <span className="font-medium">{file.name}</span>
                  </td>
                  <td>Only you</td>
                  <td>{file.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} DropBox UI Clone. For demo purposes only.
      </footer>
    </div>
  );
}
