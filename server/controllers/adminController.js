// server/controllers/adminController.js
const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel");
const Driver = require("../models/driverModel");
const User = require("../models/userModel");

// @desc    Get basic analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({
    status: "Completed",
  });
  const totalDrivers = await Driver.countDocuments();
  const totalUsers = await User.countDocuments();

  const analytics = {
    totalBookings,
    completedBookings,
    totalDrivers,
    totalUsers,
  };

  res.json(analytics);
});

// @desc    Get all drivers
// @route   GET /api/admin/drivers
// @access  Private/Admin
const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({}).select("-password");
  res.json(drivers);
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "name email")
    .populate("driver", "name email");
  res.json(bookings);
});

// @desc    Get driver performance
// @route   GET /api/admin/driver-performance/:id
// @access  Private/Admin
const getDriverPerformance = asyncHandler(async (req, res) => {
  const driverId = req.params.id;
  const completedBookings = await Booking.countDocuments({
    driver: driverId,
    status: "Completed",
  });
  const totalBookings = await Booking.countDocuments({ driver: driverId });
  const averageRating = await Booking.aggregate([
    { $match: { driver: driverId, status: "Completed" } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  const performance = {
    completedBookings,
    totalBookings,
    completionRate:
      totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
    averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
  };

  res.json(performance);
});

module.exports = {
  getAnalytics,
  getAllDrivers,
  getAllBookings,
  getDriverPerformance,
};
