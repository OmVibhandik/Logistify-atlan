import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserBookings } from "../features/booking/bookingSlice";
import { updateDriverLocation } from "../features/tracking/trackingSlice";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  // Box,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import socket from "../utils/socket";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 0,
  lng: 0,
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.booking);
  const { driverLocation } = useSelector((state) => state.tracking);
  // const { user } = useSelector((state) => state.auth);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    dispatch(getUserBookings());

    socket.on("driverLocationUpdate", (location) => {
      dispatch(updateDriverLocation(location));
      setMapCenter({ lat: location.lat, lng: location.lng });
    });

    return () => {
      socket.off("driverLocationUpdate");
    };
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Bookings
          </Typography>
          {bookings.length > 0 ? (
            <List>
              {bookings.map((booking) => (
                <ListItem key={booking._id}>
                  <ListItemText
                    primary={`Booking ID: ${booking._id}`}
                    secondary={`Status: ${booking.status} | From: ${booking.pickupLocation} | To: ${booking.dropoffLocation}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No bookings found.</Typography>
          )}
        </Paper>
        <Button
          component={RouterLink}
          to="/book"
          variant="contained"
          color="primary"
          fullWidth
        >
          Create New Booking
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Driver Location
          </Typography>
          {/* <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={10}
            >
              {driverLocation && (
                <Marker
                  position={{
                    lat: driverLocation.lat,
                    lng: driverLocation.lng,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
