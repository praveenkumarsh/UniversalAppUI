import { useState } from "react";
import { Paperclip } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Hey, how’s it going?" },
    { sender: "You", text: "All good! Working on that new feature." },
    { sender: "Alice", text: "Nice, keep it up!" },
  ]);

  const onlineUsers = ["Alice", "Bob", "Charlie"];

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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <main className="flex flex-1">
        {/* Chat Window */}
        <div className="w-2/3 flex flex-col justify-between px-6 py-6">
          <div className="space-y-4 overflow-auto max-h-[70vh] pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-md ${
                    msg.sender === "You"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p className="text-xs mb-1 opacity-70">
                    {msg.sender === "You" ? "You" : msg.sender}
                  </p>
                  {msg.text && <p className="mb-1">{msg.text}</p>}
                  {msg.attachment && (
                    <a
                      href={msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-blue-300"
                    >
                      📎 {msg.fileName}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input with Attachment */}
          <div className="mt-6 flex items-center gap-2">
            {/* File input trigger */}
            <label className="cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition">
              <Paperclip size={18} />
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Message input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md transition"
            >
              Send
            </button>
          </div>

          {/* Show selected file name */}
          {attachment && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-1">
              📎 {attachment.name}
            </div>
          )}
        </div>

        {/* Online Users */}
        <div className="w-1/3 border-l border-gray-300 dark:border-gray-700 px-4 py-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-300 mb-4">
            👥 Online Users
          </h3>
          <ul className="space-y-3 text-sm">
            {onlineUsers.map((user) => (
              <li
                key={user}
                className="border border-gray-300 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-900"
              >
                <span className="text-emerald-500 font-semibold">{user}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} ChatApp UI Clone. Demo only.
      </footer>
    </div>
  );
}
