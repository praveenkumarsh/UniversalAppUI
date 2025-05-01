import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { config } from "../../config";

export default function PasteBin() {
  const { theme } = useTheme();
  const [pasteText, setPasteText] = useState("");
  const [pasteLink, setPasteLink] = useState("");
  const [error, setError] = useState("");
  const [expiry, setExpiry] = useState("Never");
  const [privacy, setPrivacy] = useState("Public");
  const [syntax, setSyntax] = useState("PHP");
  const [fileName, setFileName] = useState("My script.php");
  const [pastes, setPastes] = useState([]);

  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  const [editingPaste, setEditingPaste] = useState(null);

  useEffect(() => {
    fetch(`${config.backendUrl}/api/paste`, {
      headers: {
        Authorization: `Bearer ${token}`, // or use your auth mechanism
      },
    })
      .then((res) => res.json())
      .then((data) => setPastes(data))
      .catch(() => setError("Failed to load pastes."));
  }, []);  

  const expiryToDuration = {
    "Never": null,
    "10 Minutes": "PT10M",
    "1 Hour": "PT1H",
    "1 Day": "P1D",
    "1 Week": "P7D",
  };  

  const handleGeneratePaste = () => {
    if (!pasteText.trim()) {
      setError("Paste content cannot be empty.");
      setPasteLink("");
      return;
    }
    
    const requestBody = {
      title: fileName,
      content: pasteText,
      language: syntax,
      visibility: privacy.toUpperCase(),
      password: "",
      expiration: expiryToDuration[expiry],
    };

    fetch(`${config.backendUrl}/api/paste`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // If required
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create paste");
        return res.json();
      })
      .then((data) => {
        setPasteLink(`${window.location.origin}/paste/${data.key}`);
        setPasteText("");
        setPastes((prev) => [data, ...prev]);
      })
      .catch((err) => {
        setError(err.message || "Error creating paste");
      });
  };  

  const handleDeletePaste = (key) => {
    if (!confirm("Are you sure you want to delete this paste?")) return;
  
    fetch(`${config.backendUrl}/api/paste/${key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setPastes((prev) => prev.filter((p) => p.key !== key));
        if (editingPaste?.key === key) {
          setEditingPaste(null);
          setPasteText("");
        }
      })
      .catch(() => alert("Failed to delete paste"));
  };

  const handleUpdatePaste = () => {
    if (!pasteText.trim()) {
      setError("Paste content cannot be empty.");
      return;
    }
  
    const requestBody = {
      title: fileName,
      content: pasteText,
      language: syntax,
      visibility: privacy.toUpperCase(),
      password: "",
      expiration: expiryToDuration[expiry],
    };
  
    fetch(`${config.backendUrl}/api/paste/${editingPaste.key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update paste");
        return res.json();
      })
      .then((data) => {
        setPastes((prev) =>
          prev.map((p) => (p.key === editingPaste.key ? data : p))
        );
        setPasteLink(`${window.location.origin}/paste/${data.key}`);
        setPasteText("");
        setEditingPaste(null);
      })
      .catch((err) => {
        setError(err.message || "Error updating paste");
      });
  };  
  

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-2/3 px-8 py-6 flex flex-col gap-6">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`<?php\n  echo 'PasteBin is pretty sweet';\n?>`}
            className={`h-80 border rounded-2xl p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-800 text-white border-gray-700 focus:ring-emerald-600"
                : "bg-gray-100 text-gray-800 border-gray-300 focus:ring-emerald-500"
            }`}
          />

          {/* Options */}
          <div className={`rounded-2xl p-4 ${isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-300"}`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Paste Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Expiry", value: expiry, onChange: setExpiry, options: ["Never", "10 Minutes", "1 Hour", "1 Day", "1 Week"] },
                { label: "Privacy", value: privacy, onChange: setPrivacy, options: ["Public", "Unlisted", "Private"] },
                { label: "Syntax", value: syntax, onChange: setSyntax, options: ["PHP", "JavaScript", "Python", "Java", "Plain Text"] },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <label className={`block mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{label}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-md p-2 ${
                      isDark
                        ? "bg-gray-900 text-white border-gray-700"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label className={`block mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`w-full border rounded-md p-2 ${
                    isDark ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit + Link */}
          <div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {/* <button
              onClick={handleGeneratePaste}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition text-sm font-semibold"
            >
              {editingPaste ? "Update Paste" : "Create Paste"}
            </button> */}

            <button
              onClick={editingPaste ? handleUpdatePaste : handleGeneratePaste}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition text-sm font-semibold"
            >
              {editingPaste ? "Update Paste" : "Create Paste"}
            </button>


            {/* <button
              onClick={handleSubmitPaste}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition text-sm font-semibold"
            >
              {editingPaste ? "Update Paste" : "Create Paste"}
            </button> */}


            {pasteLink && (
              <div className="mt-4 text-sm">
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-1`}>Your Paste Link:</p>
                <a
                  href={pasteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline break-all"
                >
                  {pasteLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`w-1/3 px-6 py-6 overflow-y-auto border-l ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
          <h3 className={`text-md font-semibold mb-4 ${isDark ? "text-gray-100" : "text-gray-700"}`}>📜 Recent Pastes</h3>
          {pastes.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {pastes.map((paste) => (
                <li
                  key={paste.id}
                  className={`rounded-2xl p-4 shadow-sm relative ${
                    isDark ? "bg-gray-700 text-gray-100 border border-gray-600" : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {/* Edit/Delete Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => {
                        setEditingPaste(paste);
                        setPasteText(paste.content);
                        setFileName(paste.title);
                        setPrivacy(paste.visibility);
                        setSyntax(paste.language);
                        const matchedExpiry = Object.entries(expiryToDuration).find(
                          ([, val]) => val === paste.expiration
                        );
                        setExpiry(matchedExpiry ? matchedExpiry[0] : "Never");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeletePaste(paste.key)}
                      className="text-xs px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{paste.title}</span>
                    {/* <span className="text-xs opacity-70">{new Date(paste.createdAt).toLocaleString()}</span> */}
                  </div>

                  <div className="text-emerald-400 truncate">
                    <a
                      href={`${window.location.origin}/paste/${paste.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {`${window.location.origin}/paste/${paste.key}`}
                    </a>
                  </div>

                  <div className="text-xs mt-1 opacity-70">
                    {paste.language} • {paste.visibility} • Expires:{" "}
                    {paste.expiresAt ? new Date(paste.expiresAt).toLocaleString() : "Never"}
                  </div>
                </li>
                            
              ))}
            </ul>
          ) : (
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>No pastes available.</p>
          )}
        </div>
      </main>

      <footer className={`px-6 py-4 text-center text-xs border-t ${isDark ? "text-gray-500 border-gray-700" : "text-gray-500 border-gray-200"}`}>
        © {new Date().getFullYear()} PasteBin UI Clone. Demo only.
      </footer>
    </div>
  );
}
