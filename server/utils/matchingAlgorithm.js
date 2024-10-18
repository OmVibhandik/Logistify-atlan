// server/utils/matchingAlgorithm.js
const Driver = require("../models/driverModel");

const findNearestDriver = async (pickupLocation, vehicleType) => {
  try {
    const nearestDriver = await Driver.findOne({
      vehicleType,
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: pickupLocation,
          },
          $maxDistance: 50000, // 50 km radius
        },
      },
    }).sort("currentLocation");

    return nearestDriver;
  } catch (error) {
    console.error("Error finding nearest driver:", error);
    return null;
  }
};

module.exports = {
  findNearestDriver,
};
