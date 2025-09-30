import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const STORAGE_KEYS = {
  token: "authToken",
  role: "userRole",
  email: "userEmail",
};

const DEFAULT_ROLE = "clinic-staff";

const initialAuthState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.token) || "";
    const role = localStorage.getItem(STORAGE_KEYS.role) || "";
    const email = localStorage.getItem(STORAGE_KEYS.email) || "";
    return { token, role, email };
  } catch {
    return { token: "", role: "", email: "" };
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { token: t, role: r, email: e } = initialAuthState();
    setToken(t);
    setRole(r);
    setEmail(e);
    setIsReady(true);
  }, []);

  const login = useCallback(
    (nextToken, nextRole = DEFAULT_ROLE, nextEmail = "") => {
      setToken(nextToken);
      setRole(nextRole);
      setEmail(nextEmail);
      try {
        localStorage.setItem(STORAGE_KEYS.token, nextToken);
        localStorage.setItem(STORAGE_KEYS.role, nextRole);
        if (nextEmail) localStorage.setItem(STORAGE_KEYS.email, nextEmail);
      } catch {}
    },
    []
  );

  const logout = useCallback(() => {
    setToken("");
    setRole("");
    setEmail("");
    try {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.role);
      localStorage.removeItem(STORAGE_KEYS.email);
      localStorage.removeItem("authTimestamp");
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("mhrs-user-role");
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      token,
      role,
      email,
      isReady,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, role, email, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const ProtectedRoute = () => {
  const { isReady, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isReady) return null;
  if (!isAuthenticated) {
    return (
      <Navigate to="/login-authentication" replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles = [] }) => {
  const { isReady, isAuthenticated, role } = useAuth();
  const location = useLocation();
  if (!isReady) return null;
  if (!isAuthenticated) {
    return (
      <Navigate to="/login-authentication" replace state={{ from: location }} />
    );
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/multi-portal-dashboard" replace />;
  }
  return <Outlet />;
};
