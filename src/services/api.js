// API service for REST Countries API

// Base URL for the REST Countries API
const API_BASE_URL = "https://restcountries.com/v3.1";

// Fetch all countries
export const fetchAllCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all countries:", error);
    throw error;
  }
};

// Fetch country by name
export const fetchCountryByName = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/name/${name}`);
    if (!response.ok) {
      throw new Error("Failed to fetch country by name");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching country by name (${name}):`, error);
    throw error;
  }
};

// Fetch countries by region
export const fetchCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${API_BASE_URL}/region/${region}`);
    if (!response.ok) {
      throw new Error("Failed to fetch countries by region");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching countries by region (${region}):`, error);
    throw error;
  }
};

// Fetch country by code (alpha code)
export const fetchCountryByCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alpha/${code}`);
    if (!response.ok) {
      throw new Error("Failed to fetch country by code");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching country by code (${code}):`, error);
    throw error;
  }
};
