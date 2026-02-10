import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await axios.get(apiUrl("/auth/current_user"), {
        withCredentials: true
      });
      setUser(res.data); // User object or null
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(apiUrl("/auth/logout"), {
        withCredentials: true
      });
      setUser(null);
      window.location.href = "/"; // Force full reload/redirect
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
