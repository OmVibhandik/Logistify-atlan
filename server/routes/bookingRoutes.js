const express = require("express");
const router = express.Router();
const {
  registerDriver,
  loginDriver,
  updateDriverLocation,
  updateDriverAvailability,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const {
  createBooking,
  getUserBookings,
  estimatePrice
} = require("../controllers/bookingController") 
const { protect, admin } = require("../middleware/authMiddleware");


router.post("/", protect, createBooking);
router.get("/", protect, getUserBookings);
router.post("/estimate", protect, estimatePrice);
router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.put("/location", protect, updateDriverLocation);
router.put("/availability", protect, updateDriverAvailability);
router.get("/", protect, admin, getAllDrivers);
router.get("/:id", protect, admin, getDriverById);
router.put("/:id", protect, admin, updateDriver);
router.delete("/:id", protect, admin, deleteDriver);

module.exports = router;
