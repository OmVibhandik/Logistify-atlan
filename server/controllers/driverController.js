const Driver = require("../models/Driver");
const Booking = require("../models/Booking");

exports.acceptBooking = async (req, res) => {
  const { bookingId, driverId } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { driver: driverId, status: "accepted" },
      { new: true }
    );
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
