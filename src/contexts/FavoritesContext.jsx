"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/userService";

const FavoritesContext = createContext(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Function to fetch favorites
  const fetchFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]);
    }
  };

  // Function to clear favorites
  const clearFavorites = () => {
    setFavorites([]);
  };

  // Monitor authentication state
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchFavorites();
      } else {
        clearFavorites();
      }
    };

    // Initial check
    checkToken();

    // Listen for storage changes (e.g., token removed in another tab)
    window.addEventListener("storage", checkToken);

    // Cleanup listener
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const addFavoriteCountry = async (countryCode) => {
    try {
      await addFavorite(countryCode);
      setFavorites((prev) => [...prev, countryCode]);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Please login to add this country to favorites.");
      }
      throw new Error("Failed to add favorite: " + error.message);
    }
  };

  const removeFavoriteCountry = async (countryCode) => {
    try {
      await removeFavorite(countryCode);
      setFavorites((prev) => prev.filter((code) => code !== countryCode));
    } catch (error) {
      throw new Error("Failed to remove favorite");
    }
  };

  const isFavorite = (countryCode) => {
    return favorites.includes(countryCode);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite: addFavoriteCountry,
        removeFavorite: removeFavoriteCountry,
        isFavorite,
        fetchFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
