// pages/Signup.tsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto mt-20">
      <h2 className="text-xl mb-4">Sign Up</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 w-full border" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 w-full border" />
      <button type="submit" className="w-full bg-green-600 text-white py-2">Sign Up</button>
    </form>
  );
}
