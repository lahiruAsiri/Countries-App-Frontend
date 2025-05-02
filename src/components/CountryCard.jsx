"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardActionArea,
  Skeleton,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../contexts/FavoritesContext";

const CountryCard = ({ country }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite(country.cca3)) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country.cca3);
    }
  };

  const handleCardClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <Box sx={{ position: "relative", pt: "56.25%" }}>
          {!imageLoaded && !imageError && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              animation="wave"
            />
          )}
          <CardMedia
            component="img"
            image={imageError ? "/placeholder-flag.png" : country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imageLoaded && !imageError ? "block" : "none",
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap>
            {country.name.common}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Population:</strong>{" "}
              {formatPopulation(country.population)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Region:</strong> {country.region}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Subregion:</strong> {country.subregion || "N/A"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Tooltip
        title={
          isFavorite(country.cca3)
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        <IconButton
          aria-label={
            isFavorite(country.cca3)
              ? "Remove from favorites"
              : "Add to favorites"
          }
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.9)",
            },
            zIndex: 1,
          }}
        >
          {isFavorite(country.cca3) ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon color="action" />
          )}
        </IconButton>
      </Tooltip>
    </Card>
  );
};

export default CountryCard;
