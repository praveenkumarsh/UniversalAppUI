import { useState, useEffect, useCallback } from "react";
import { Paperclip } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config";

interface OnlineUser {
  id: string;
  name: string;
  email: string;
}

interface WebSocketIncomingMessage {
  type: 'heartbeat' | 'offline' | 'error' | 'chat';
  users?: OnlineUser[];
  message?: string;
}

interface ChatMessage {
  sender: string;
  text: string;
  attachment?: string | null;
  fileName?: string | null;
  timestamp: number; // Add timestamp field
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const clientId = uuidv4();

  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !user?.token) return;
  
    try {
      const res = await fetch(`${config.backendUrl}/api/chat/messages?with=${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedUser, user?.token]); 

  const handleSend = async () => {
    if (!message.trim() || !selectedUser || !user?.token) return;
  
    const payload = {
      text: message,
      receiverId: selectedUser.id,
      fileName: attachment?.name ?? null,
      attachment: null, // optional: add file upload logic if needed
    };
  
    try {
      const res = await fetch(`${config.backendUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error("Failed to send message");

      const websocket = new WebSocket(`${config.backendUrl}/chatapp?token=${user.token}`);
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setWs(websocket);
        const sendMessageToWebhook = () => {
          websocket.send(JSON.stringify({
            type: 'chat',
            from: user.name,
            to: selectedUser.id,
            message: message,
            clientId
          }));
        };
    
        sendMessageToWebhook();
      };
  
      setMessage("");
      setAttachment(null);
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);  

  useEffect(() => {
    if (!user?.token) return;
  
    const websocket = new WebSocket(`${config.backendUrl}/chatapp?token=${user.token}`);
    let interval: NodeJS.Timeout;
  
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setWs(websocket);
  
      const sendHeartbeat = () => {
        websocket.send(JSON.stringify({
          type: 'heartbeat',
          clientId
        }));
      };
  
      sendHeartbeat(); // Initial
      interval = setInterval(sendHeartbeat, 25000);
    };
  
    websocket.onmessage = (event) => {
      const message: WebSocketIncomingMessage = JSON.parse(event.data);
      console.log('Received message:', message);
      switch (message.type) {
        case 'heartbeat':
        case 'offline':
          if (message.users) setOnlineUsers(message.users);
          break;
        case 'error':
          console.error('WebSocket error:', message.message);
          break;
        case 'chat':
          // const parsed: ChatMessage = JSON.parse(message);
          const parsed: ChatMessage = message;
          console.log('Parsed message:', parsed);
          console.log('User ID:', user.id);
          if (parsed.to !== user.id) {
            setMessages((prev) => [...prev, parsed]);
            console.log('Message for this user:', parsed);
          } else {
            console.log('Message not for this user:', parsed);
          }
          // setMessages((prev) => [...prev, parsed]);
          // break;
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
      clearInterval(interval);
    };

    return () => {
      clearInterval(interval);
      websocket.close();
      websocket.send(JSON.stringify({
        type: 'offline',
        clientId
      }));
    };
  }, [user?.token]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString();
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
                  className={`max-w-sm rounded-2xl shadow p-3 text-sm ${msg.sender === "You" ? (theme === "dark" ? "bg-emerald-600 text-white" : "bg-emerald-500 text-white") : (theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border")}`}
                >
                  <p className="text-xs mb-1 opacity-70">{msg.sender === user.id ? "You" : msg.sender}</p>

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
                  
                  <p className="text-xs mt-1 text-white-500">{formatTimestamp(msg.timestamp)}</p> {/* Timestamp */}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div className={`mt-6 border-t pt-4 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
            <div className="flex items-center gap-2">
              <label className={`cursor-pointer flex items-center justify-center p-3 rounded-xl transition ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                <Paperclip size={18} />
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
          <h3 className="text-base font-semibold mb-4">👥 Online Users</h3>
          <ul className="space-y-3 text-sm">
            {onlineUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer rounded-2xl p-3 shadow-sm ${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800"} ${selectedUser?.id === user.id ? "ring-2 ring-emerald-500" : ""}`}
              >
                <div className="text-emerald-500 font-medium">{user.name}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
