"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import CountryCard from "../components/CountryCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { fetchAllCountries } from "../services/api";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFavoriteCountries = async () => {
      if (favorites.length === 0) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allCountries = await fetchAllCountries();
        const favoriteCountryObjects = allCountries.filter((country) =>
          favorites.includes(country.cca3)
        );
        setFavoriteCountries(favoriteCountryObjects);
        setLoading(false);
      } catch (err) {
        setError("Failed to load favorite countries");
        setLoading(false);
      }
    };

    getFavoriteCountries();
  }, [favorites]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Your Favorite Countries
        </Typography>
        <Divider />
      </Box>

      {favoriteCountries.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <PublicIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            You haven't added any countries to your favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Explore countries and click the heart icon to add them to your
            favorites
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? "white" : "black",
              color: theme.palette.mode === "dark" ? "black" : "white",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "white" : "black",
              },
            })}
          >
            Explore Countries
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteCountries.map((country) => (
            <Grid item key={country.cca3} xs={12} sm={6} md={4}>
              <CountryCard country={country} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
