"use client";

import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PublicIcon from "@mui/icons-material/Public";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeModeContext";
import { useFavorites } from "../contexts/FavoritesContext";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const { mode, toggleThemeMode } = useThemeMode();
  const { favorites } = useFavorites();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { text: "Home", path: "/" },
    {
      text: "Favorites",
      path: "/favorites",
      icon: <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },
    ...(user
      ? [{ text: "Logout", path: "#", action: logout }]
      : [
          { text: "Login", path: "/login" },
          { text: "Register", path: "/register" },
        ]),
  ];

  const drawer = (
    <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={item.action}
            selected={location.pathname === item.path}
          >
            {item.icon && item.icon}
            <ListItemText primary={item.text} />
            {item.text === "Favorites" && favorites.length > 0 && (
              <Box
                key={favorites.length} // Force re-render on favorites change
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 1,
                  fontSize: "0.75rem",
                }}
              >
                {favorites.length}
              </Box>
            )}
          </ListItem>
        ))}
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleThemeMode}
                color="primary"
                inputProps={{ "aria-label": "toggle dark mode" }}
              />
            }
            label={mode === "dark" ? "Dark Mode" : "Light Mode"}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <PublicIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              textDecoration: "none",
            }}
          >
            Country Explorer
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="toggle dark mode"
              onClick={toggleThemeMode}
              sx={{ mr: 1 }}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={RouterLink}
                to={item.path}
                onClick={item.action}
                startIcon={item.icon}
                sx={{
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  position: "relative",
                }}
              >
                {item.text}
                {item.text === "Favorites" && favorites.length > 0 && (
                  <Box
                    key={favorites.length} // Force re-render on favorites change
                    sx={{
                      bgcolor: "secondary.main",
                      color: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: -5,
                      right: -5,
                      fontSize: "0.75rem",
                    }}
                  >
                    {favorites.length}
                  </Box>
                )}
              </Button>
            ))}
            <IconButton
              color="inherit"
              aria-label="toggle dark mode"
              onClick={toggleThemeMode}
              sx={{ ml: 1 }}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;