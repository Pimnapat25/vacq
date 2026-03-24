import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../api/index.js";
import { clearToken, getToken } from "../api/token.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await api.me();
      const u = res.data ?? null;
      setUser(u);
      return u;
    } catch {
      clearToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(
    async (body) => {
      setLoading(true);
      try {
        await api.login(body);
        const res = await api.me();
        const u = res.data ?? null;
        setUser(u);
        return u;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (body) => {
      setLoading(true);
      try {
        await api.register(body);
        const res = await api.me();
        const u = res.data ?? null;
        setUser(u);
        return u;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      refreshMe,
      login,
      register,
      logout
    }),
    [user, loading, refreshMe, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
