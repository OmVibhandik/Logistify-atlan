const User = require("../models/User");
const Admin = require("../models/Admin");
const Driver = require("../models/Driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let tokenBlacklist = [];

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body);
    let user;

    // Switch statement to check role and find the user in the appropriate schema
    switch (role) {
      case "driver":
        user = await Driver.findOne({ email });
        break;
      case "admin":
        user = await Admin.findOne({ email });
        break;
      case "user":
      default:
        user = await User.findOne({ email });
        break;
    }
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // console.log(req.body);

    // console.log(user)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // console.log(req.body);
    // console.log("isMatch ?",isMatch)
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("token",token)

    res.json({ token });
    tokenBlacklist = tokenBlacklist.filter(storedToken => {
        try {
            jwt.verify(storedToken, process.env.JWT_SECRET);
            return true;
        } catch (error) {
            return false;
        }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    // Choose schema based on role
    switch (role) {
      case "driver":
        newUser = new Driver({ email, password: hashedPassword, role });
        break;
      case "admin":
        newUser = new Admin({ email, password: hashedPassword, role });
        break;
      case "user":
      default:
        newUser = new User({ email, password: hashedPassword, role });
        break;
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  // Add token to blacklist
  tokenBlacklist.push(token);
  res.json({ message: "User logged out successfully" });
};
