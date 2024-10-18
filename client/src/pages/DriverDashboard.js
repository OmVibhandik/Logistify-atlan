import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDriverJobs, updateJobStatus } from "../features/job/jobSlice";
import { updateDriverLocation } from "../features/driver/driverSlice";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading } = useSelector((state) => state.job);
  const { currentDriver } = useSelector((state) => state.driver);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(getDriverJobs());
    // Simulating location updates
    const intervalId = setInterval(() => {
      const newLocation = {
        lat: Math.random() * (90 - -90) + -90,
        lng: Math.random() * (180 - -180) + -180,
      };
      dispatch(updateDriverLocation(newLocation));
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleStatusUpdate = (jobId, newStatus) => {
    dispatch(updateJobStatus({ jobId, status: newStatus }));
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Driver Dashboard
      </Typography>
      {currentDriver && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Location
          </Typography>
          <Typography>
            Latitude: {currentDriver.lat.toFixed(6)}, Longitude:{" "}
            {currentDriver.lng.toFixed(6)}
          </Typography>
        </Paper>
      )}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Jobs
        </Typography>
        {jobs.length > 0 ? (
          <List>
            {jobs.map((job) => (
              <ListItem
                key={job._id}
                button
                onClick={() => setSelectedJob(job)}
              >
                <ListItemText
                  primary={`Job ID: ${job._id}`}
                  secondary={`Status: ${job.status} | From: ${job.pickupLocation} | To: ${job.dropoffLocation}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No jobs found.</Typography>
        )}
      </Paper>
      {selectedJob && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Job Details
          </Typography>
          <Typography>Pickup: {selectedJob.pickupLocation}</Typography>
          <Typography>Dropoff: {selectedJob.dropoffLocation}</Typography>
          <Typography>Current Status: {selectedJob.status}</Typography>
          <Select
            value={selectedJob.status}
            onChange={(e) =>
              handleStatusUpdate(selectedJob._id, e.target.value)
            }
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="En Route to Pickup">En Route to Pickup</MenuItem>
            <MenuItem value="Goods Collected">Goods Collected</MenuItem>
            <MenuItem value="En Route to Dropoff">En Route to Dropoff</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </Paper>
      )}
    </Box>
  );
};

export default DriverDashboard;
