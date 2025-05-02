"use client";

import { useState } from "react";
import { TextField, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearchChange }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearchChange(newQuery);
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for a country..."
        value={query}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Paper>
  );
};

export default SearchBar;
