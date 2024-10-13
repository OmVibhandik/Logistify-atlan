const express = require("express");
const router = express.Router();
const {
  getDashboardData,
  manageFleet,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", isAdmin, getDashboardData);
router.get("/manage/fleet", isAdmin, manageFleet);

module.exports = router;
