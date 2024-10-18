import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookings } from "../features/booking/bookingSlice";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BookingMap from "../components/BookingMap";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.booking);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Bookings
        </Typography>
        {bookings.length > 0 ? (
          <List>
            {bookings.map((booking) => (
              <ListItem
                key={booking._id}
                button
                onClick={() => setSelectedBooking(booking)}
              >
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
      {selectedBooking && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Real-Time Tracking
          </Typography>
          <BookingMap booking={selectedBooking} />
        </Paper>
      )}
      <Button
        component={RouterLink}
        to="/book"
        variant="contained"
        color="primary"
        fullWidth
      >
        Create New Booking
      </Button>
    </Box>
  );
};

export default UserDashboard;
