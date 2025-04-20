import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  token: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const dummyUser = {
          token: "google-dummy-token",
          email: "googleuser@example.com",
        };
        setUser(dummyUser);
        localStorage.setItem("auth", JSON.stringify(dummyUser));
        resolve();
      }, 1000);
    });
  };

  // Dummy login function
  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          const dummyUser = { token: "dummy-token", email };
          setUser(dummyUser);
          localStorage.setItem("auth", JSON.stringify(dummyUser));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Dummy signup function
  const signup = async (email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const dummyUser = { token: "dummy-token", email };
        setUser(dummyUser);
        localStorage.setItem("auth", JSON.stringify(dummyUser));
        resolve();
      }, 1000); // Simulate network delay
    });
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