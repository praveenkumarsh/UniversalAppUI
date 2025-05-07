import React, { useEffect, useState } from "react";
import {
  Trash2,
  Pencil,
  LayoutGrid,
  FileSpreadsheet,
  Folder,
  RotateCcw
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { config } from "../../config";

type FileMetadata = {
  name: string;
  uploadedDate: string;
  size: string;
  type: "file" | "folder";
};

export default function DropBox() {
  const [selected, setSelected] = useState<string[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [view, setView] = useState<"myFiles" | "recycleBin">("myFiles");
  const { theme } = useTheme();
  const [fullName, setFullName] = useState("");
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [name]
      // prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };  

  fetch(`${config.backendUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user details");
      return res.json();
    })
    .then((data) => {
      setFullName(data.fullName); // Assuming username is used as full name
    })
    .catch((err) => {
      console.error("Error fetching user details:", err);
    });

  const fetchFiles = async () => {
    const url =
      view === "recycleBin"
        ? `${config.backendUrl}/api/files/recyclebin`
        : `${config.backendUrl}/api/files`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      alert("Failed to load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [view]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("visibility", "private");
    formData.append("directory", "");

    try {
      const res = await fetch(`${config.backendUrl}/api/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const message = await res.text();
      alert("Uploaded file : " + message);
      fetchFiles();
    } catch (error) {
      alert("Upload failed");
    }
  };

  const handleDelete = async () => {
    for (const fileName of selected) {
      try {
        await fetch(`${config.backendUrl}/api/files/${encodeURIComponent(fileName)}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (e) {
        alert(`Failed to delete ${fileName}`);
      }
    }
    setSelected([]);
    fetchFiles();
  };

  const handlePermanentDelete = async () => {
    for (const fileName of selected) {
      try {
        await fetch(
          `${config.backendUrl}/api/files/${encodeURIComponent(fileName)}/hard`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (e) {
        alert(`Failed to permanently delete ${fileName}`);
      }
    }
    setSelected([]);
    fetchFiles();
  };

  const handleEmptyRecycleBin = async () => {
    if (!window.confirm("Are you sure you want to empty the Recycle Bin?")) return;

    try {
      await fetch(`${config.backendUrl}/api/files/recyclebin`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected([]);
      fetchFiles();
    } catch (error) {
      alert("Failed to empty Recycle Bin");
    }
  };

  const handleRestore = async () => {
    for (const fileName of selected) {
      try {
        await fetch(
          `${config.backendUrl}/api/files/${encodeURIComponent(fileName)}/restore`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (e) {
        alert(`Failed to restore ${fileName}`);
      }
    }
    setSelected([]);
    fetchFiles();
  };
  

  const handleDownload = async () => {
    for (const fileName of selected) {

      try {
        const response = await fetch(`${config.backendUrl}/api/files/${fileName}/download`, {
          headers: {
            Authorization: `Bearer ${token}`, // if needed
          },
        });
  
        if (!response.ok) throw new Error(`Failed to download file ${fileName}`);
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed", error);
      }
    }
  };  

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black"}`}>
      <aside className={`w-64 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-r border-gray-200"} p-4 text-sm`}>
        <div className="font-bold text-lg mb-4">{fullName}</div>
        <nav className={`space-y-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          <div onClick={() => setView("myFiles")} className={`cursor-pointer ${view === "myFiles" ? "text-blue-600 font-medium" : ""}`}>📁 My files</div>
          <div onClick={() => setView("recycleBin")} className={`cursor-pointer ${view === "recycleBin" ? "text-blue-600 font-medium" : ""}`}>🗑 Recycle bin</div>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className={`flex-1 flex flex-col overflow-hidden rounded-lg shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        {selected.length > 0 && (
          <div
            className={`sticky top-0 z-10 p-3 border-b flex justify-between items-center text-sm ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <div className="flex gap-4">
              {view === "recycleBin" ? (
                <>
                  <button onClick={handlePermanentDelete} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
                    <Trash2 size={16} /> Delete Permanently
                  </button>
                  <button onClick={handleRestore} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                    <RotateCcw size={16} /> Restore
                  </button>
                </>              
              ) : (
                <>
                  <button onClick={handleDelete} className="flex items-center gap-1 hover:text-red-400">
                    <Trash2 size={16} /> Delete
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-1 hover:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    Download
                  </button>
                </>
              )}
            </div>
            <button onClick={() => setSelected([])} className="border border-gray-300 rounded-full px-3 py-1">
              ✕ {selected.length} selected
            </button>
          </div>
        )}

          <div className="overflow-y-auto flex-1">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-xl font-semibold">
                {view === "recycleBin" ? "Recycle Bin" : "My Files"}
              </h2>
              {view === "recycleBin" ? (
                <button
                  onClick={handleEmptyRecycleBin}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Empty Bin
                </button>
              ) : (
                <label className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded cursor-pointer">
                  Upload File
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Modified</th>
                  <th className="p-2 text-left">File size</th>
                  <th className="p-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr
                    key={f.name}
                    className={`border-t ${theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "hover:bg-blue-50"} ${
                      selected.includes(f.name) ? (theme === "dark" ? "bg-gray-600" : "bg-blue-100") : ""
                    }`}
                    onClick={() => toggle(f.name)}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(f.name)}
                        onChange={() => toggle(f.name)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      {f.type === "folder" ? <Folder size={16} /> : <FileSpreadsheet size={16} />}
                      {f.name}
                    </td>
                    <td className="p-2">{new Date(f.uploadedDate).toLocaleString()}</td>
                    {/* @ts-ignore */}
                    <td className="p-2">{formatBytes(f.size)}</td>
                    <td className="p-2">{f.type}</td>
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
