// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAnalytics,
  getAllDrivers,
  getAllBookings,
  getDriverPerformance,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/analytics", protect, admin, getAnalytics);
router.get("/drivers", protect, admin, getAllDrivers);
router.get("/bookings", protect, admin, getAllBookings);
router.get("/driver-performance/:id", protect, admin, getDriverPerformance);

module.exports = router;
