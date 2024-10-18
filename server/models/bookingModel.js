// server/models/bookingModel.js
const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["Small", "Medium", "Large", "Extra Large"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    price: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({
  pickupLocation: "2dsphere",
  dropoffLocation: "2dsphere",
});

module.exports = mongoose.model("Booking", bookingSchema);
