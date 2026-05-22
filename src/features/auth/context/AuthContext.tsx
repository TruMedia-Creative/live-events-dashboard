import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "client";
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "auth.session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface StoredSession {
  userId: string;
  expiresAt: number;
}

const adminPassword =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "admin";

// True when no custom admin password has been set via environment variable.
export const isDemoMode =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) === undefined;

const USERS: AuthUser[] = [
  { id: "admin-1", username: "admin", role: "admin" },
  { id: "demo-1", username: "demo", role: "client" },
];

function findUser(username: string, password: string): AuthUser | null {
  if (username === "admin" && password === adminPassword) {
    return USERS.find((u) => u.id === "admin-1") ?? null;
  }
  if (username === "demo" && password === "demo") {
    return USERS.find((u) => u.id === "demo-1") ?? null;
  }
  return null;
}

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredSession;
    if (Date.now() > stored.expiresAt) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return USERS.find((u) => u.id === stored.userId) ?? null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser) {
  try {
    const stored: StoredSession = {
      userId: user.id,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  } catch {
    return;
  }
}

function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    return;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  function login(username: string, password: string): boolean {
    const matched = findUser(username, password);
    if (matched) {
      setUser(matched);
      writeSession(matched);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isDemoMode, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
