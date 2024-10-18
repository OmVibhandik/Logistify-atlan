const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Driver = require("../models/driverModel");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // Set connection timeout to 30 seconds
  socketTimeoutMS: 45000, // Set socket timeout to 45 seconds
});

const drivers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phoneNumber: "1234567890",
    licenseNumber: "DL12345",
    vehicleType: "Medium",
    currentLocation: {
      type: "Point",
      coordinates: [-73.935242, 40.73061], // New York City coordinates
    },
    isAvailable: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    phoneNumber: "0987654321",
    licenseNumber: "DL67890",
    vehicleType: "Large",
    currentLocation: {
      type: "Point",
      coordinates: [-118.243683, 34.052235], // Los Angeles coordinates
    },
    isAvailable: true,
  },
  // Add more drivers as needed
];

const seedDrivers = async () => {
  try {
    await Driver.deleteMany({});
    console.log("Deleted existing drivers");

    for (const driver of drivers) {
      const salt = await bcrypt.genSalt(10);
      driver.password = await bcrypt.hash(driver.password, salt);
      await Driver.create(driver);
    }

    console.log("Drivers seeded successfully");
    mongoose.connection.close(); // Properly close the connection
  } catch (error) {
    console.error("Error seeding drivers:", error);
    mongoose.connection.close(); // Properly close the connection even on error
  }
};

seedDrivers();
