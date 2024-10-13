const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      pickupLocation,
      dropoffLocation,
      vehicleType,
      estimatedCost,
    } = req.body;
    const newBooking = new Booking({
      user: userId,
      pickupLocation,
      dropoffLocation,
      vehicleType,
      estimatedCost,
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
