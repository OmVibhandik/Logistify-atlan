// server/models/driverModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const driverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    licenseNumber: {
      type: String,
      required: [true, "Please add a license number"],
      unique: true,
    },
    vehicleType: {
      type: String,
      required: [true, "Please add a vehicle type"],
      enum: ["Small", "Medium", "Large", "Extra Large"],
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

driverSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Driver", driverSchema);
