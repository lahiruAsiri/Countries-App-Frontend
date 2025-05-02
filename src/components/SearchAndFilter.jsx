"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchAndFilter = ({
  onSearchChange,
  onRegionChange,
  onLanguageChange,
  countries,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const theme = useTheme();

  // Extract unique languages from all countries
  useEffect(() => {
    if (countries.length > 0) {
      const languages = new Set();

      countries.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((language) => {
            languages.add(language);
          });
        }
      });

      setAvailableLanguages(Array.from(languages).sort());
    }
  }, [countries]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;
    setSelectedRegion(value);
    onRegionChange(value);
  };

  const handleLanguageChange = (event) => {
    const value = event.target.value;
    setSelectedLanguage(value);
    onLanguageChange(value);
  };

  return (
    <Box
      sx={{
        mb: 4,
        py: 4,
        bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.50",
        borderRadius: { xs: 0, md: 2 },
        textAlign: "center",
      }}
      id="countries"
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 4, mt: 4 }}
        >
          Find Your Country
        </Typography>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for a country..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="region-select-label">
                  Filter by Region
                </InputLabel>
                <Select
                  labelId="region-select-label"
                  id="region-select"
                  value={selectedRegion}
                  label="Filter by Region"
                  onChange={handleRegionChange}
                >
                  <MenuItem value="">All Regions</MenuItem>
                  <MenuItem value="Africa">Africa</MenuItem>
                  <MenuItem value="Americas">Americas</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Oceania">Oceania</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="language-select-label">
                  Filter by Language
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={selectedLanguage}
                  label="Filter by Language"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="">All Languages</MenuItem>
                  {availableLanguages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default SearchAndFilter;
