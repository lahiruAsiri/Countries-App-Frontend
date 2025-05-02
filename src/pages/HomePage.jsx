"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import HeroSection from "../components/HeroSection";
import SearchAndFilter from "../components/SearchAndFilter";
import CountryList from "../components/CountryList";
import { fetchAllCountries } from "../services/api";

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        setLoading(false);
      }
    };

    getCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion
        ? country.region === selectedRegion
        : true;
      const matchesLanguage = selectedLanguage
        ? country.languages &&
          Object.values(country.languages).includes(selectedLanguage)
        : true;
      return matchesSearch && matchesRegion && matchesLanguage;
    });
    setFilteredCountries(filtered);
  }, [searchQuery, selectedRegion, selectedLanguage, countries]);

  return (
    <Box>
      <HeroSection />
      <Box id="search-and-filter">
        <SearchAndFilter
          onSearchChange={setSearchQuery}
          onRegionChange={setSelectedRegion}
          onLanguageChange={setSelectedLanguage}
          countries={countries}
        />
      </Box>
      <CountryList
        countries={filteredCountries}
        loading={loading}
        error={error}
      />
    </Box>
  );
};

export default HomePage;
