import { createContext, useContext, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "auth.session";

function readSession(): boolean {
  try {
    return window.localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSession(value: boolean) {
  try {
    if (value) {
      window.localStorage.setItem(SESSION_KEY, "1");
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    return;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readSession);

  function login(username: string, password: string): boolean {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      writeSession(true);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    writeSession(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
