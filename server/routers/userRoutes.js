const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/userController");
const { isUser } = require("../middleware/authMiddleware");

if(router.post("/login", login)){console.log("Login Hit")}
router.post("/register", register);
router.get("/logout", isUser, logout);

module.exports = router;
