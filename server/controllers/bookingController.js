// server/controllers/bookingController.js
const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel");
const Driver = require("../models/driverModel");
const { findNearestDriver } = require("../utils/matchingAlgorithm");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { pickupLocation, dropoffLocation, vehicleType } = req.body;

  if (!pickupLocation || !dropoffLocation || !vehicleType) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Find the nearest available driver
  const nearestDriver = await findNearestDriver(pickupLocation, vehicleType);

  if (!nearestDriver) {
    res.status(404);
    throw new Error("No available drivers found");
  }

  // Calculate price, distance, and estimated duration
  // This is a simplified version. In a real-world scenario, you'd use more complex calculations
  const distance = calculateDistance(pickupLocation, dropoffLocation);
  const price = calculatePrice(distance, vehicleType);
  const estimatedDuration = calculateEstimatedDuration(distance);

  const booking = await Booking.create({
    user: req.user._id,
    driver: nearestDriver._id,
    pickupLocation: {
      type: "Point",
      coordinates: pickupLocation,
    },
    dropoffLocation: {
      type: "Point",
      coordinates: dropoffLocation,
    },
    vehicleType,
    price,
    distance,
    estimatedDuration,
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error("Invalid booking data");
  }
});

const estimatePrice = asyncHandler(async (req, res) => {
  const { pickupLocation, dropoffLocation, vehicleType } = req.body;

  if (!pickupLocation || !dropoffLocation || !vehicleType) {
    res.status(400);
    throw new Error(
      "Please provide pickup location, dropoff location, and vehicle type"
    );
  }

  // Find the nearest available driver
  const nearestDriver = await Driver.findOne({
    isAvailable: true,
    vehicleType,
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            parseFloat(pickupLocation.split(",")[1]),
            parseFloat(pickupLocation.split(",")[0]),
          ],
        },
        $maxDistance: 50000, // 50 km radius
      },
    },
  });

  if (!nearestDriver) {
    res.status(404);
    throw new Error("No available drivers found nearby");
  }

  // Calculate distance (simplified version, you may want to use a more accurate method)
  const pickupCoords = pickupLocation.split(",").map(Number);
  const dropoffCoords = dropoffLocation.split(",").map(Number);
  const distance = calculateDistance(pickupCoords, dropoffCoords);

  // Calculate price based on distance and vehicle type
  const basePrice = 5; // Base fare
  const pricePerKm = vehicleType === "Sedan" ? 1.5 : 2; // Price per km based on vehicle type
  const estimatedPrice = basePrice + distance * pricePerKm;

  res.json({
    estimatedPrice: estimatedPrice.toFixed(2),
    distance: distance.toFixed(2),
    currency: "USD",
  });
});

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "driver",
    "name phoneNumber"
  );
  res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

module.exports = {
  createBooking,
  getUserBookings,
  estimatePrice,
  updateBookingStatus,
};

// Helper functions (simplified versions)
function calculateDistance(pickup, dropoff) {
  // Implement distance calculation logic
  return Math.random() * 50; // Placeholder
}

function calculatePrice(distance, vehicleType) {
  // Implement pricing logic
  const basePrice = 10;
  const pricePerKm = 2;
  return basePrice + distance * pricePerKm;
}

function calculateEstimatedDuration(distance) {
  // Implement duration calculation logic
  const averageSpeed = 40; // km/h
  return (distance / averageSpeed) * 60; // minutes
}

// Helper function to calculate distance (simplified version)
function calculateDistance(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}