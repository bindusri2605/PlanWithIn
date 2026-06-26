const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new user with hashed password security
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Secure password using bcrypt with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user instance
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    await user.save();

    // Return success status and user metadata for frontend session handling
    res.status(201).json({ 
      status: "SUCCESS", 
      userId: user._id, 
      name: user.name 
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error during registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates user and returns session data
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Attempt to locate user by email
    const user = await User.findOne({ email });

    // Validate user existence and verify password integrity
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Successful authentication: Return user ID for local storage persistence
    res.json({ 
      status: "SUCCESS", 
      userId: user._id, 
      name: user.name 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

module.exports = router;