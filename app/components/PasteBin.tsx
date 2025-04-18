import { useState, useEffect } from "react";

export default function PasteBin() {
  const [pasteText, setPasteText] = useState("");
  const [pasteLink, setPasteLink] = useState("");
  const [error, setError] = useState("");
  const [expiry, setExpiry] = useState("Never");
  const [privacy, setPrivacy] = useState("Public");
  const [syntax, setSyntax] = useState("PHP");
  const [fileName, setFileName] = useState("My script.php");
  const [pastes, setPastes] = useState([]);

  // Mock JSON load
  useEffect(() => {
    const mockPastes = [
      {
        id: "abc123",
        text: "console.log('Hello World');",
        expiry: "1 Day",
        privacy: "Public",
        syntax: "JavaScript",
        fileName: "hello.js",
        link: "https://paste.ly/abc123",
        createdAt: "2025-04-15 10:30 AM",
      },
      {
        id: "def456",
        text: "print('Hello Python')",
        expiry: "Never",
        privacy: "Private",
        syntax: "Python",
        fileName: "script.py",
        link: "https://paste.ly/def456",
        createdAt: "2025-04-14 09:00 PM",
      },
    ];
    setPastes(mockPastes);
  }, []);

  const handleGeneratePaste = () => {
    if (!pasteText.trim()) {
      setError("Paste content cannot be empty.");
      setPasteLink("");
      return;
    }

    setError("");
    const pasteId = Math.random().toString(36).substring(2, 10);
    const newLink = `https://paste.ly/${pasteId}`;
    setPasteLink(newLink);

    const newPaste = {
      id: pasteId,
      text: pasteText,
      expiry,
      privacy,
      syntax,
      fileName,
      link: newLink,
      createdAt: new Date().toLocaleString(),
    };

    setPastes([newPaste, ...pastes]);
    setPasteText("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Paste Form */}
        <div className="w-2/3 px-6 py-4 flex flex-col">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`<?php\n  echo 'PasteBin is pretty sweet';\n?>`}
            className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-md p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 overflow-auto"
          />

          {/* Options */}
          <div className="mt-4 bg-gray-900 border border-gray-700 rounded-md p-4">
            <h3 className="text-md font-semibold mb-4 text-gray-300">↑ Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-400">Expiry</label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                >
                  <option>Never</option>
                  <option>10 Minutes</option>
                  <option>1 Hour</option>
                  <option>1 Day</option>
                  <option>1 Week</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-400">Privacy</label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                >
                  <option>Public</option>
                  <option>Unlisted</option>
                  <option>Private</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-400">Syntax</label>
                <select
                  value={syntax}
                  onChange={(e) => setSyntax(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                >
                  <option>PHP</option>
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>Plain Text</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-400">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleGeneratePaste}
              className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 text-sm font-semibold"
            >
              Submit
            </button>
          </div>

          {/* Paste Link */}
          {pasteLink && (
            <div className="mt-4 text-sm">
              <p className="text-gray-400 mb-1">Your Paste Link:</p>
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

        {/* Right: Paste List */}
        <div className="w-1/3 px-4 py-4 border-l border-gray-700 bg-gray-950 overflow-y-auto">
          <h3 className="text-md font-semibold text-gray-300 mb-4">📜 All Pastes</h3>
          {pastes.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {pastes.map((paste) => (
                <li key={paste.id} className="border border-gray-700 rounded-md p-3 bg-gray-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">{paste.fileName}</span>
                    <span className="text-gray-500 text-xs">{paste.createdAt}</span>
                  </div>
                  <div className="text-emerald-400 truncate">
                    <a href={paste.link} target="_blank" rel="noopener noreferrer">
                      {paste.link}
                    </a>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {paste.syntax} | {paste.privacy} | Expires: {paste.expiry}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pastes available.</p>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} PasteBin UI Clone. For demo purposes only.
      </footer>
    </div>
  );
}
