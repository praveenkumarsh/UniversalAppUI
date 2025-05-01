import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { config } from "../../config";

export default function ViewPaste() {
  const { key } = useParams();
  const [paste, setPaste] = useState<any>(null);
  const [error, setError] = useState("");
  const [publicPastes, setPublicPastes] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${config.backendUrl}/paste/${key}`)
      .then((res) => {
        if (!res.ok) throw new Error("Paste not found");
        return res.json();
      })
      .then(setPaste)
      .catch((err) => setError(err.message));
  }, [key]);

  useEffect(() => {
    fetch(`${config.backendUrl}/api/paste/explore`)
      .then((res) => res.json())
      .then(setPublicPastes)
      .catch(() => {}); // silently fail if this fails
  }, []);

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!paste) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      {/* Main Paste Viewer */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-2">{paste.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          {paste.language} • {paste.visibility} • {new Date(paste.createdAt).toLocaleString()}
        </p>
        <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
          {paste.content}
        </pre>
      </div>

      {/* Public Pastes Sidebar */}
      <div className="w-full md:w-1/3 max-h-[80vh] overflow-y-auto bg-gray-100 p-4 rounded-xl border border-gray-300">
        <h2 className="text-lg font-semibold mb-4">🌐 Public Pastes</h2>
        {publicPastes.length > 0 ? (
            <ul className="space-y-3 text-sm">
            {publicPastes.map((p) => (
                <li key={p.key} className="bg-white border rounded-lg p-3 hover:shadow transition">
                <Link
                    to={`/paste/${p.key}`}
                    className="block text-blue-600 hover:underline font-medium"
                >
                    {p.title}
                </Link>
                <p className="text-xs text-gray-500">
                    {p.language} • {new Date(p.createdAt).toLocaleString()}
                </p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-500">No public pastes found.</p>
        )}
        </div>/.l
    </div>
  );
}
