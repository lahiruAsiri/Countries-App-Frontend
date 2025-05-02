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

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  const addFavoriteCountry = async (countryCode) => {
    try {
      await addFavorite(countryCode);
      setFavorites((prev) => [...prev, countryCode]);
    } catch (error) {
      throw new Error("Failed to add favorite");
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
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
