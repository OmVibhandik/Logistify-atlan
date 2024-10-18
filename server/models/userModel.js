// server/models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
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
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      default: "user",
    },
    // Additional fields for drivers
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
    vehicleType: {
      type: String,
      required: function () {
        return this.role === "driver";
      },
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
