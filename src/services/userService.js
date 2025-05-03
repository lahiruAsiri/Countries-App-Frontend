import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests with logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log request details for debugging
  console.log("API Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get("/favorites");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch favorites"
    );
  }
};

export const addFavorite = async (countryCode) => {
  try {
    // Ensure countryCode is valid
    if (!countryCode || typeof countryCode !== "string") {
      throw new Error("Invalid country code");
    }
    // Adjust payload based on backend requirements
    const payload = { countryCode };
    const response = await api.post("/favorites/add", payload);
    return response.data;
  } catch (error) {
    // Preserve backend error message for 401 to allow FavoritesContext to handle it
    if (error.response?.status === 401) {
      throw error; // Let FavoritesContext catch and process
    }
    throw new Error(error.response?.data?.message || "Failed to add favorite");
  }
};

export const removeFavorite = async (countryCode) => {
  try {
    // Ensure countryCode is valid
    if (!countryCode || typeof countryCode !== "string") {
      throw new Error("Invalid country code");
    }
    const response = await api.delete(`/favorites/remove/${countryCode}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove favorite"
    );
  }
};
