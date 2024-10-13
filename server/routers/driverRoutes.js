const express = require("express");
const router = express.Router();
const {
  acceptBooking,
  updateStatus,
} = require("../controllers/driverController");
const { isDriver } = require("../middleware/authMiddleware");

router.post("/accept", isDriver, acceptBooking);
router.post("/status", isDriver, updateStatus);

module.exports = router;
