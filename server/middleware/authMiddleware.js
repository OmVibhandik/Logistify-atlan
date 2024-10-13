const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

// Middleware to authenticate and authorize users
const isUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to authenticate and authorize drivers
const isDriver = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const driver = await Driver.findById(decoded.id);
    if (!driver) return res.status(401).json({ message: "Unauthorized" });

    req.driver = driver;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to authenticate and authorize admins
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming the admin role can be checked via the user document
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin")
      return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { isUser, isDriver, isAdmin };
