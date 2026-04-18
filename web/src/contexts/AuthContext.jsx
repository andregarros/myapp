import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  const login = useCallback(async (email, password) => {
    const result = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setSession(result);
  }, []);

  const register = useCallback(async (payload) => {
    const result = await api("/auth/register", {
      method: "POST",
      body: payload,
    });
    setSession(result);
  }, []);

  const logout = useCallback(() => setSession(null), []);
  const updateSession = useCallback(
    (patch) => setSession((current) => (current ? { ...current, ...patch } : current)),
    []
  );

  const value = useMemo(
    () => ({
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
    }),
    [login, logout, register, session, updateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
