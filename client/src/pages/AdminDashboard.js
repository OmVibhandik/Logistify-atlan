import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../features/booking/bookingSlice";
import { getAllDrivers } from "../features/driver/driverSlice";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const { drivers } = useSelector((state) => state.driver);
  const [analytics, setAnalytics] = useState({
    totalTrips: 0,
    averageTripTime: 0,
    topDrivers: [],
  });

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllDrivers());
  }, [dispatch]);

  useEffect(() => {
    if (bookings.length > 0) {
      const completedTrips = bookings.filter(
        (booking) => booking.status === "Delivered"
      );
      const totalTrips = completedTrips.length;
      const totalTripTime = completedTrips.reduce(
        (acc, booking) => acc + (booking.deliveredAt - booking.createdAt),
        0
      );
      const averageTripTime = totalTripTime / totalTrips;

      const driverPerformance = {};
      completedTrips.forEach((booking) => {
        if (!driverPerformance[booking.driverId]) {
          driverPerformance[booking.driverId] = { trips: 0, totalTime: 0 };
        }
        driverPerformance[booking.driverId].trips += 1;
        driverPerformance[booking.driverId].totalTime +=
          booking.deliveredAt - booking.createdAt;
      });

      const topDrivers = Object.entries(driverPerformance)
        .map(([driverId, performance]) => ({
          driverId,
          trips: performance.trips,
          averageTime: performance.totalTime / performance.trips,
        }))
        .sort((a, b) => b.trips - a.trips)
        .slice(0, 5);

      setAnalytics({
        totalTrips,
        averageTripTime,
        topDrivers,
      });
    }
  }, [bookings]);

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analytics
        </Typography>
        <Typography>Total Trips: {analytics.totalTrips}</Typography>
        <Typography>
          Average Trip Time:{" "}
          {(analytics.averageTripTime / (1000 * 60)).toFixed(2)} minutes
        </Typography>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Performing Drivers
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver ID</TableCell>
                <TableCell>Trips Completed</TableCell>
                <TableCell>Average Trip Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.topDrivers.map((driver) => (
                <TableRow key={driver.driverId}>
                  <TableCell>{driver.driverId}</TableCell>
                  <TableCell>{driver.trips}</TableCell>
                  <TableCell>
                    {(driver.averageTime / (1000 * 60)).toFixed(2)} minutes
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fleet Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Vehicle Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>{driver._id}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.vehicleType}</TableCell>
                  <TableCell>
                    {driver.isAvailable ? "Available" : "Busy"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
