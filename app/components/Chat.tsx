import { useState } from "react";
import { Paperclip } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Hey, how’s it going?" },
    { sender: "You", text: "All good! Working on that new feature." },
    { sender: "Alice", text: "Nice, keep it up!" },
  ]);
  const onlineUsers = ["Alice", "Bob", "Charlie"];
  const { theme } = useTheme();

  const handleSend = () => {
    if (!message.trim() && !attachment) return;

    const newMsg = {
      sender: "You",
      text: message,
      attachment: attachment ? URL.createObjectURL(attachment) : null,
      fileName: attachment?.name || null,
    };

    setMessages([...messages, newMsg]);
    setMessage("");
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Chat Section */}
      <main className="flex flex-1 overflow-hidden">
        {/* Messages Column */}
        <div className="flex flex-col flex-1 p-6">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm rounded-2xl shadow p-3 text-sm ${
                    msg.sender === "You"
                      ? theme === "dark"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border"
                  }`}
                >
                  <p className="text-xs mb-1 opacity-70">
                    {msg.sender}
                  </p>
                  {msg.text && <p className="mb-1">{msg.text}</p>}
                  {msg.attachment && (
                    <a
                      href={msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline text-blue-300"
                    >
                      📎 {msg.fileName}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div className={`mt-6 border-t pt-4 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
            <div className="flex items-center gap-2">
              <label className={`cursor-pointer flex items-center justify-center p-3 rounded-xl transition ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                <Paperclip size={18} />
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 p-3 rounded-xl focus:outline-none focus:ring-2 ${theme === "dark" ? "bg-gray-800 text-white border border-gray-600 focus:ring-emerald-600" : "bg-white border border-gray-300 focus:ring-emerald-500"}`}
              />

              <button
                onClick={handleSend}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition"
              >
                Send
              </button>
            </div>

            {attachment && (
              <div className="text-sm text-gray-400 mt-2 ml-1">
                📎 {attachment.name}
              </div>
            )}
          </div>
        </div>

        {/* Online Users */}
        <aside className={`w-80 border-l p-6 overflow-y-auto ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h3 className="text-base font-semibold mb-4">
            👥 Online Users
          </h3>
          <ul className="space-y-3 text-sm">
            {onlineUsers.map((user) => (
              <li
                key={user}
                className={`rounded-2xl p-3 shadow-sm ${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800"}`}
              >
                <span className="text-emerald-500 font-medium">{user}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
