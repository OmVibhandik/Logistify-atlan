import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBooking, estimatePrice } from "../features/booking/bookingSlice";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationSearch from "../components/LocationSearch";

const vehicleTypes = ["Small", "Medium", "Large", "Extra Large"];

const BookingForm = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.booking);

  const handleEstimatePrice = () => {

    console.log("pickupLocation_coordinates", pickupLocation);

    if (pickupLocation && dropoffLocation) {
      
      const pickupCoords = pickupLocation.coordinates; // [lng, lat]
      const dropoffCoords = dropoffLocation.coordinates; // [lng, lat]

      dispatch(
        estimatePrice({
          pickupLocation: pickupCoords,
          dropoffLocation: dropoffCoords,
          vehicleType,
        })
      ).then((result) => {
        if (result.payload) {
          setEstimatedPrice(result.payload.estimatedPrice);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickupLocation && dropoffLocation) {
      console.log("pickupLocation_coordinates", pickupLocation);
      const pickupCoords = pickupLocation.coordinates; // [lng, lat]
      const dropoffCoords = dropoffLocation.coordinates; // [lng, lat]

      dispatch(
        createBooking({
          pickupLocation: pickupCoords,
          dropoffLocation: dropoffCoords,
          vehicleType,
        })
      ).then((result) => {
        if (result.type === "booking/create/fulfilled") {
          navigate("/user-dashboard");
        }
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Booking
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <LocationSearch onLocationSelect={setPickupLocation} />
          <LocationSearch onLocationSelect={setDropoffLocation} />
          <TextField
            margin="normal"
            required
            fullWidth
            id="vehicleType"
            select
            label="Vehicle Type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            {vehicleTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleEstimatePrice}
            disabled={!pickupLocation || !dropoffLocation || !vehicleType}
          >
            Estimate Price
          </Button>
          {estimatedPrice !== null && (
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Estimated Price: ${estimatedPrice.toFixed(2)}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !estimatedPrice}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create Booking"}
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingForm;
