import React, { useState, useEffect } from "react";
import { config } from "../../config";

export default function ShortURL() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [error, setError] = useState("");
  const [recentUrls, setRecentUrls] = useState<
    { id: string; short: string; long: string; createdAt: string }[]
  >([]);

  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  useEffect(() => {
    fetchRecentUrls();
  }, []);
  
  const fetchRecentUrls = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/shorturl/fetchall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch URLs");
      const data = await response.json();
  
      const urls = data.map((url: { shortUrl: string; originalUrl: string }) => ({
        id: url.shortUrl.split("/").pop()!,
        short: url.shortUrl,
        long: url.originalUrl,
        createdAt: "", // optionally populate if backend supports
      }));
  
      setRecentUrls(urls);
    } catch (err) {
      console.error(err);
    }
  };

// useEffect(() => {
//   const fetchRecentUrls = async () => {
//     try {
//       const response = await fetch(`${config.backendUrl}"/api/shorturl/fetchall");
//       if (!response.ok) {
//         throw new Error("Failed to fetch recent URLs");
//       }

//       const data = await response.json(); // this should be List<ShortUrlsResponse> from your backend

//       const urls = data.map((url: { shortUrl: string; originalUrl: string }) => ({
//         id: url.shortUrl.split("/").pop(),
//         short: url.shortUrl,
//         long: url.originalUrl,
//         createdAt: "", // your backend does not send createdAt, so leave empty or improve later
//       }));

//       setRecentUrls(urls);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchRecentUrls();
// }, []);


  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError("Long URL cannot be empty.");
      setShortLink("");
      return;
    }
  
    setError("");
  
    try {
      let response;
      if (customAlias.trim()) {
        // Call custom short URL API
        response = await fetch(`${config.backendUrl}/api/shorturl/custom`, {
          method: "POST",
          headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            longUrl: longUrl,
            customKey: customAlias.trim(),
          }),
        });
      } else {
        // Call normal short URL API
        response = await fetch(`${config.backendUrl}/api/shorturl`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            longUrl: longUrl,
          }),
        });
      }
  
      if (!response.ok) {
        throw new Error("Failed to create short URL");
      }
  
      const data = await response.json();
  
      const newEntry = {
        id: data.shortUrl.split("/").pop(), // extract the key part
        short: data.shortUrl,
        long: data.originalUrl,
        createdAt: new Date().toLocaleString(),
      };
  
      setRecentUrls([newEntry, ...recentUrls]);
      setShortLink(`${window.location.href}/${newEntry.id}`);
      setLongUrl("");
      setCustomAlias("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while shortening the URL.");
    }
  }; 
  
  const handleDelete = async (key: string) => {
    try {
      const response = await fetch(`${config.backendUrl}/api/shorturl/delete/${key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to delete URL");
  
      setRecentUrls((prev) => prev.filter((url) => url.id !== key));
    } catch (err) {
      console.error(err);
      alert("Failed to delete URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002848] to-[#1BA6C7] text-white flex flex-col">
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-2/3 px-8 py-6 flex flex-col gap-6">
          <div className="bg-white text-black rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">🔗 Shorten a Long URL</h2>
            <input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              type="text"
              placeholder="Paste your long URL here..."
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-sm"
            />
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600 font-medium">{window.location.href}/</span>
              <input
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                type="text"
                placeholder="custom-alias"
                className="flex-1 border border-gray-300 p-2 rounded-md text-sm"
              />
            </div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              onClick={handleShorten}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold"
            >
              Shorten URL
            </button>

            {shortLink && (
              <div className="mt-4 text-sm">
                <p className="text-gray-700 mb-1">Your Short URL:</p>
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline break-all"
                >
                  {shortLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Recent URLs */}
        <div className="w-1/3 px-6 py-6 border-l border-white/20 bg-white/10 overflow-y-auto">
          <h3 className="text-md font-semibold text-white mb-4">🕘 Recent Shortened URLs</h3>
          {recentUrls.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {recentUrls.map((url) => (
                <li
                  key={url.id}
                  className="border border-white/20 rounded-2xl p-4 bg-white/10 backdrop-blur-md shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-medium truncate">
                    <a
                      href={`${window.location.href}/${url.short}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {`${window.location.href}/${url.short}`}
                    </a>
                  </span>
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <a
                    href={url.long}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 text-xs truncate hover:underline"
                  >
                    {url.long}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/70 text-sm">No shortened URLs yet.</p>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-white/60 border-t border-white/20">
        © {new Date().getFullYear()} TinyURL UI Clone. Demo only.
      </footer>
    </div>
  );
}
