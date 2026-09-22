const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { verifyToken, blacklist } = require("../middleware/auth");

const router = express.Router();

// simple patterns used for validating the input
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // clean the input first
    const username = (req.body.username || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: "Username must be 3 to 20 characters" });
    }
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ message: "Username can only have letters, numbers and _" });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      return res.status(400).json({ message: "Username is already taken" });
    }

    // hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Registration successful, you can login now" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email });
    // same message for both cases so nobody can guess which emails exist
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create the token, it is valid for 1 hour
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

// PROTECTED ROUTE - used by the dashboard page
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // password is removed from the result
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

// LOGOUT - the token is blacklisted so it cannot be used anymore
router.post("/logout", verifyToken, (req, res) => {
  blacklist.add(req.token);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
