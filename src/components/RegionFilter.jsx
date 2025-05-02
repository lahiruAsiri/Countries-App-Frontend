"use client";

import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const RegionFilter = ({ onRegionChange }) => {
  const [region, setRegion] = useState("");

  const handleChange = (event) => {
    const newRegion = event.target.value;
    setRegion(newRegion);
    onRegionChange(newRegion);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="region-select-label">Filter by Region</InputLabel>
      <Select
        labelId="region-select-label"
        id="region-select"
        value={region}
        label="Filter by Region"
        onChange={handleChange}
      >
        <MenuItem value="">All Regions</MenuItem>
        <MenuItem value="Africa">Africa</MenuItem>
        <MenuItem value="Americas">Americas</MenuItem>
        <MenuItem value="Asia">Asia</MenuItem>
        <MenuItem value="Europe">Europe</MenuItem>
        <MenuItem value="Oceania">Oceania</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RegionFilter;
