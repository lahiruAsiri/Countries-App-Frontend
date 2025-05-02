"use client";

import { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CountryCard from "./CountryCard";

const CountryList = ({ countries, loading, error }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const cardsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(countries.length / cardsPerPage);
  const currentPage = Math.floor(scrollPosition / cardsPerPage) + 1;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth / cardsPerPage;
      const scrollAmount =
        direction === "left"
          ? -cardWidth * cardsPerPage
          : cardWidth * cardsPerPage;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // Update scroll position after animation
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const newPosition = Math.round(
            scrollContainerRef.current.scrollLeft / cardWidth
          );
          setScrollPosition(newPosition);
        }
      }, 500);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (countries.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6">
          No countries found matching your criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h2">
          Countries
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleScroll("left")}
            disabled={scrollPosition === 0}
            sx={{ bgcolor: "background.paper", boxShadow: 1 }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2">
            {currentPage} / {totalPages}
          </Typography>
          <IconButton
            onClick={() => handleScroll("right")}
            disabled={currentPage >= totalPages}
            sx={{ bgcolor: "background.paper", boxShadow: 1 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          pb: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{ flexWrap: "nowrap", minWidth: "100%" }}
        >
          {countries.map((country) => (
            <Grid
              item
              key={country.cca3}
              xs={12}
              sm={6}
              md={2.4}
              sx={{ minWidth: isMobile ? "100%" : isTablet ? "50%" : "20%" }}
            >
              <CountryCard country={country} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CountryList;
