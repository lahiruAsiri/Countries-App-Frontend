"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GlobeVisualization from "./GlobeVisualization";

// Background images for light and dark modes
const backgroundLight = "/assets/background_light.jpg";
const backgroundDark = "/assets/background_dark.jpg";

const HeroSection = () => {
  const theme = useTheme();

  // Handle scroll to SearchAndFilter section
  const handleScrollToCountries = () => {
    const searchAndFilterSection = document.getElementById("search-and-filter");
    if (searchAndFilterSection) {
      searchAndFilterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 8, md: 0 },
        pb: { xs: 8, md: 0 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? `url(${backgroundDark})`
            : `url(${backgroundLight})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.08)"
              : "rgba(255, 255, 255, 0)",
          zIndex: 1,
        },
        zIndex: 0,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} alignItems="center">
          {/* Left side - Text content */}
          <Grid item xs={12} md={7} sx={{ zIndex: 2 }}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                marginLeft: { xs: 0, md: 10 },
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg,rgb(255, 255, 255),rgb(255, 255, 255))"
                      : "inherit",
                  WebkitBackgroundClip:
                    theme.palette.mode === "dark" ? "text" : "inherit",
                  WebkitTextFillColor:
                    theme.palette.mode === "dark" ? "transparent" : "inherit",
                }}
              >
                Explore Our World
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                color={"text.secondary"}
                sx={{
                  mb: 4,
                  maxWidth: { md: "80%" },
                  fontSize: { xs: "1.5rem", md: "1.8rem", lg: "2rem" },
                }}
              >
                Discover countries, cultures, and facts from around the globe
                with our interactive explorer
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleScrollToCountries}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  backgroundColor: () =>
                    theme.palette.mode === "dark" ? "#fff" : "black",
                  color: () =>
                    theme.palette.mode === "dark" ? "#000" : "#fff",
                  "&:hover": {
                    backgroundColor: () =>
                      theme.palette.mode === "dark" ? "#f0f0f0" : "black",
                  },
                }}
              >
                Explore Countries
              </Button>
            </Box>
          </Grid>

          {/* Right side - 3D Globe */}
          <Grid item xs={12} md={4} sx={{ position: "relative" }}>
            <Box
              sx={{
                height: { xs: "50vh", md: "70vh" },
                width: "100%",
                position: "relative",
              }}
            >
              <GlobeVisualization />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Background gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "100%", md: "50%" },
          height: "100%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(63,81,181,0.15) 0%, rgba(18, 18, 18, 0) 70%)"
              : "radial-gradient(circle, rgba(63, 81, 181, 0) 0%, rgba(245, 245, 245, 0) 70%)",
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default HeroSection;
