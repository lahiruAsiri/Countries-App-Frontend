"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/userService";
import { useFavorites } from "./FavoritesContext";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearFavorites } = useFavorites(); // Import clearFavorites

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const { user, token } = await registerUser(name, email, password);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const login = async (email, password) => {
    try {
      const { user, token } = await loginUser(email, password);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearFavorites(); // Clear favorites on logout
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
