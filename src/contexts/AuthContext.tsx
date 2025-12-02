import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  otherUser: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_USERS = {
  Joffreyg: "mustafo",
  Hana: "usagi",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chatUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const validPassword = VALID_USERS[username as keyof typeof VALID_USERS];
    if (validPassword && validPassword === password) {
      const newUser = { username };
      setUser(newUser);
      localStorage.setItem("chatUser", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chatUser");
  };

  const otherUser = user
    ? user.username === "Joffreyg"
      ? "Hana"
      : "Joffreyg"
    : null;

  return (
    <AuthContext.Provider value={{ user, login, logout, otherUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
