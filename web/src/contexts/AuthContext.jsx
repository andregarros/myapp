import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = sessionStorage.getItem("smartmarket:web:session");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (session) {
      sessionStorage.setItem("smartmarket:web:session", JSON.stringify(session));
    } else {
      sessionStorage.removeItem("smartmarket:web:session");
    }
  }, [session]);

  const login = async (email, password) => {
    const result = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setSession(result);
  };

  const register = async (payload) => {
    const result = await api("/auth/register", {
      method: "POST",
      body: payload,
    });
    setSession(result);
  };

  const logout = () => setSession(null);
  const updateSession = (patch) => setSession((current) => (current ? { ...current, ...patch } : current));

  return (
    <AuthContext.Provider
      value={{
        session,
        token: session?.token,
        user: session?.user,
        company: session?.company,
        subscription: session?.subscription,
        isAuthenticated: Boolean(session?.token),
        login,
        register,
        logout,
        updateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
