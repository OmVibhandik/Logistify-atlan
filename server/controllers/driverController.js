// server/controllers/driverController.js
const asyncHandler = require("express-async-handler");
const Driver = require("../models/driverModel");
const generateToken = require("../utils/jwtUtils");


// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private/Admin
const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({}).select('-password');
  res.json(drivers);
});

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private/Admin
const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).select('-password');
  if (driver) {
    res.json(driver);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private/Admin
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    driver.name = req.body.name || driver.name;
    driver.email = req.body.email || driver.email;
    driver.phoneNumber = req.body.phoneNumber || driver.phoneNumber;
    driver.licenseNumber = req.body.licenseNumber || driver.licenseNumber;
    driver.vehicleType = req.body.vehicleType || driver.vehicleType;

    if (req.body.password) {
      driver.password = req.body.password;
    }

    const updatedDriver = await driver.save();

    res.json({
      _id: updatedDriver._id,
      name: updatedDriver.name,
      email: updatedDriver.email,
      phoneNumber: updatedDriver.phoneNumber,
      licenseNumber: updatedDriver.licenseNumber,
      vehicleType: updatedDriver.vehicleType,
    });
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private/Admin
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    await driver.remove();
    res.json({ message: 'Driver removed' });
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});



// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Public
const registerDriver = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, licenseNumber, vehicleType } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phoneNumber ||
    !licenseNumber ||
    !vehicleType
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if driver exists
  const driverExists = await Driver.findOne({ email });

  if (driverExists) {
    res.status(400);
    throw new Error("Driver already exists");
  }

  // Create driver
  const driver = await Driver.create({
    name,
    email,
    password,
    phoneNumber,
    licenseNumber,
    vehicleType,
  });

  if (driver) {
    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      vehicleType: driver.vehicleType,
      token: generateToken(driver._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid driver data");
  }
});

// @desc    Authenticate a driver
// @route   POST /api/drivers/login
// @access  Public
const loginDriver = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for driver email
  const driver = await Driver.findOne({ email });

  if (driver && (await driver.matchPassword(password))) {
    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      vehicleType: driver.vehicleType,
      token: generateToken(driver._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Update driver location
// @route   PUT /api/drivers/location
// @access  Private
const updateDriverLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    res.status(400);
    throw new Error("Latitude and longitude are required");
  }

  const driver = await Driver.findById(req.user._id);

  if (driver) {
    driver.currentLocation = {
      type: "Point",
      coordinates: [lng, lat],
    };
    const updatedDriver = await driver.save();

    res.json({
      _id: updatedDriver._id,
      lat: updatedDriver.currentLocation.coordinates[1],
      lng: updatedDriver.currentLocation.coordinates[0],
    });
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});


// @desc    Update driver availability
// @route   PUT /api/drivers/availability
// @access  Private
const updateDriverAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;

  if (isAvailable === undefined) {
    res.status(400);
    throw new Error("Availability status is required");
  }

  const driver = await Driver.findById(req.user._id);

  if (driver) {
    driver.isAvailable = isAvailable;
    const updatedDriver = await driver.save();

    res.json({
      _id: updatedDriver._id,
      isAvailable: updatedDriver.isAvailable,
    });
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});

module.exports = {
  registerDriver,
  loginDriver,
  updateDriverLocation,
  updateDriverAvailability,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};