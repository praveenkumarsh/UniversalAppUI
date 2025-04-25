import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { config } from "../../config";

export default function Profile() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  useEffect(() => {
    if (!token) return;

    fetch(`${config.backendUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user details");
        return res.json();
      })
      .then((data) => {
        setEmail(data.email);
        setFullName(data.fullName); // Assuming username is used as full name
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  }, [token]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch(`${config.backendUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        fullName: fullName,
        password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then(() => {
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Failed to update profile");
      });
  };

  return (
    <div className={`flex items-center justify-center h-screen px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
