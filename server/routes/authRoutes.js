const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env file");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// Format user response
const formatUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subject: user.subject || "",
    availableTokens: user.availableTokens ?? 100,
    reservedTokens: user.reservedTokens ?? 0,
    earnedTokens: user.earnedTokens ?? 0,
  };
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "student", subject = "" } = req.body;

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const selectedRole = role?.trim().toLowerCase();
    const normalizedSubject = subject?.trim();

    // Required fields
    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    // Role validation
    if (!["student", "tutor"].includes(selectedRole)) {
      return res.status(400).json({
        success: false,
        message: "Role must be student or tutor",
      });
    }

    // Tutor subject validation
    if (selectedRole === "tutor" && !normalizedSubject) {
      return res.status(400).json({
        success: false,
        message: "Tutor subject is required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
      role: selectedRole,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `This email is already registered as a ${selectedRole}`,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: selectedRole,
      subject: selectedRole === "tutor" ? normalizedSubject : "",
      availableTokens: selectedRole === "student" ? 100 : 0,
      reservedTokens: 0,
      earnedTokens: 0,
    });

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Duplicate index error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email and role are already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const selectedRole = role?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (role && !["student", "tutor"].includes(selectedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const query = {
      email: normalizedEmail,
    };

    if (selectedRole) {
      query.role = selectedRole;
    }

    const users = await User.find(query);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let loggedInUser = null;

    for (const user of users) {
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (passwordMatched) {
        loggedInUser = user;
        break;
      }
    }

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(loggedInUser);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: formatUser(loggedInUser),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

module.exports = router;
