import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import L from "leaflet";

const LocationSearch = ({ onLocationSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
        );
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  };

  const handlePlaceSelect = (event, value) => {
    if (value) {
      const location = {
        name: value.display_name,
        coordinates: [value.lon, value.lat], // [lng, lat]
      };
      onLocationSelect(location);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.display_name}
      onChange={handlePlaceSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a location"
          variant="outlined"
          onChange={handleInputChange}
        />
      )}
    />
  );
};

export default LocationSearch;
