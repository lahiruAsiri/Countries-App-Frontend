"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { fetchCountryByCode } from "../services/api";
import { useFavorites } from "../contexts/FavoritesContext";

const CountryDetailsPage = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const theme = useTheme();

  useEffect(() => {
    const getCountryDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fetchCountryByCode(id);
        if (data && data.length > 0) {
          setCountry(data[0]);
        } else {
          setError("Country not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch country details");
        setLoading(false);
      }
    };

    getCountryDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!country) return;

    if (isFavorite(country.cca3)) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country.cca3);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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

  if (error || !country) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" color="error" align="center">
          {error || "Country not found"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleGoBack}
            variant="contained"
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          onClick={handleGoBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: theme.palette.mode === "dark" ? "white" : "black",
            borderColor: theme.palette.mode === "dark" ? "white" : "black",
            "&:hover": {
              borderColor: theme.palette.mode === "dark" ? "white" : "black",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          Back
        </Button>
        <Tooltip
          title={
            isFavorite(country.cca3)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <IconButton
            onClick={handleFavoriteToggle}
            color={isFavorite(country.cca3) ? "error" : "default"}
            sx={{ border: 1, borderColor: "divider" }}
          >
            {isFavorite(country.cca3) ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="300"
              image={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            {country.name.common}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {country.name.official}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Region:</strong> {country.region}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Subregion:</strong> {country.subregion || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Languages
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {country.languages ? (
                Object.values(country.languages).map((language, index) => (
                  <Chip
                    key={index}
                    label={language}
                    color="primary"
                    variant="outlined"
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "white" : "black",
                      color: theme.palette.mode === "dark" ? "black" : "white",
                    }}
                    icon={<LanguageIcon />}
                  />
                ))
              ) : (
                <Typography variant="body2">
                  No languages data available
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Currencies
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {country.currencies ? (
                Object.entries(country.currencies).map(([code, currency]) => (
                  <Chip
                    key={code}
                    label={`${currency.name} (${currency.symbol || code})`}
                    color="secondary"
                    variant="outlined"
                    icon={<AttachMoneyIcon />}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "white" : "black",
                      color: theme.palette.mode === "dark" ? "black" : "white",
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2">
                  No currency data available
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h4" gutterBottom>
            Country Information
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PublicIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Geography</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Area
                        </TableCell>
                        <TableCell align="right">
                          {country.area.toLocaleString()} km²
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Borders
                        </TableCell>
                        <TableCell align="right">
                          {country.borders?.length
                            ? country.borders.join(", ")
                            : "No bordering countries"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Landlocked
                        </TableCell>
                        <TableCell align="right">
                          {country.landlocked ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Continents
                        </TableCell>
                        <TableCell align="right">
                          {country.continents.join(", ")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LanguageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Additional Information</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Top Level Domain
                        </TableCell>
                        <TableCell align="right">
                          {country.tld?.join(", ") || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Calling Code
                        </TableCell>
                        <TableCell align="right">
                          {country.idd?.root && country.idd?.suffixes?.[0]
                            ? `${country.idd.root}${country.idd.suffixes[0]}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Drives on
                        </TableCell>
                        <TableCell align="right">
                          {country.car?.side === "left" ? "Left" : "Right"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Time Zones
                        </TableCell>
                        <TableCell align="right">
                          {country.timezones?.join(", ") || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CountryDetailsPage;
