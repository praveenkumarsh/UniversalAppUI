import { useState, useEffect } from "react";

export default function ShortURL() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [urlList, setUrlList] = useState([]);

  // Simulate fetching from JSON
  useEffect(() => {
    const mockShortUrls = [
      {
        id: "abc123",
        original: "https://www.google.com",
        short: "https://short.ly/abc123",
        createdAt: "2025-04-01 10:30 AM",
      },
      {
        id: "xyz456",
        original: "https://www.github.com",
        short: "https://short.ly/xyz456",
        createdAt: "2025-04-14 6:12 PM",
      },
    ];
    setUrlList(mockShortUrls);
  }, []);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch (_) {
      return false;
    }
  };

  const handleShorten = () => {
    if (!originalUrl.trim()) {
      setError("Please enter a URL.");
      setShortUrl("");
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError("Please enter a valid URL including http:// or https://");
      setShortUrl("");
      return;
    }

    setError("");
    const randomSlug = Math.random().toString(36).substring(2, 8);
    const short = `https://short.ly/${randomSlug}`;
    setShortUrl(short);

    const newEntry = {
      id: randomSlug,
      original: originalUrl,
      short,
      createdAt: new Date().toLocaleString(),
    };

    setUrlList((prev) => [newEntry, ...prev]);
    setOriginalUrl("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <main className="flex flex-1">
        {/* Form Area */}
        <div className="w-2/3 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-xl p-6 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <h2 className="text-3xl font-bold mb-6 text-emerald-600 text-center">
              Shorten Your URL
            </h2>

            <input
              type="text"
              placeholder="Enter your long URL here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
            />

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            <button
              onClick={handleShorten}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-md transition text-lg font-medium"
            >
              Shorten
            </button>

            {shortUrl && (
              <div className="mt-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">Shortened URL:</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline break-all"
                >
                  {shortUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right-Side List */}
        <div className="w-1/3 border-l border-gray-300 dark:border-gray-700 px-4 py-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-300 mb-4">
            🔗 Shortened URLs
          </h3>
          {urlList.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {urlList.map((url) => (
                <li
                  key={url.id}
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-900"
                >
                  <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                    {url.createdAt}
                  </div>
                  <div className="text-gray-800 dark:text-white truncate">
                    Original:{" "}
                    <span className="block text-blue-500 truncate">
                      {url.original}
                    </span>
                  </div>
                  <div className="text-emerald-500 truncate mt-1">
                    <a href={url.short} target="_blank" rel="noopener noreferrer">
                      {url.short}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-500">No URLs yet.</p>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} ShortURL. All rights reserved.
      </footer>
    </div>
  );
}
