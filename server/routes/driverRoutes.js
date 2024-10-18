// server/routes/driverRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerDriver,
  loginDriver,
  updateDriverLocation,
  updateDriverAvailability,
} = require("../controllers/driverController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerDriver);
router.post("/login", loginDriver);
router.put("/location", protect, updateDriverLocation);
router.put("/availability", protect, updateDriverAvailability);

module.exports = router;
