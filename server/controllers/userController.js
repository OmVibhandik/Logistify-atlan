// server/controllers/userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const {generateToken} = require("../utils/jwtUtils");


const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    role,
    licenseNumber,
    vehicleType,
  } = req.body;

  if (!name || !email || !password || !phoneNumber || !role) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    role,
    licenseNumber,
    vehicleType,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new admin
// @route   POST /api/users/admin-register
// @access  Public (but requires admin code)
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, adminCode } = req.body;

  if (!name || !email || !password || !phoneNumber || !adminCode) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if admin code is correct
  if (adminCode != process.env.ADMIN_REGISTRATION_CODE) {
    res.status(401);
    throw new Error('Invalid admin registration code');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create admin user
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    role: 'admin',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  getUserProfile,
};
