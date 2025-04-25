import React, { createContext, useContext, useEffect, useState } from "react";
import { config } from "../config";

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = `${config.googleClientId}`;
const REDIRECT_URI = `${config.googleRedirectUri}`;
const AUTH_URI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);

  // Auto-login using localStorage
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loginWithGoogle = async () => {
    window.location.href = AUTH_URI;
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${config.backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Login failed");
      }
  
      const data = await res.json();
  
      const user = {
        token: data.token
      };
  
      setUser(user);
      localStorage.setItem("auth", JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    const res = await fetch(`${config.backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    console.log("Signup response:", res);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Signup failed");
    }

    // const data = await res.json();
    // const user = { token: data.token }; 

    // if (data.token) {
    //   localStorage.setItem("auth", JSON.stringify(user));
    // }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};