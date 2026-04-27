const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  companyName: user.companyName,
  university: user.university,
  skills: user.skills,
  profilePic: user.profilePic,
  authProvider: user.authProvider,
});

// ── @route   POST /api/auth/register ─────────────────────────────────────────
// ── @access  Public
const register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      // student fields
      university, branch, cgpa, skills,
      // recruiter fields
      companyName, industry, website,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Prevent self-registration as admin
    const safeRole = role === "admin" ? "student" : (role || "student");

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    let parsedSkills = [];
    if (Array.isArray(skills)) parsedSkills = skills;
    else if (typeof skills === "string" && skills.trim()) {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills.split(",").map((item) => item.trim()).filter(Boolean);
      }
    }

    const userData = {
      name, email, password, role: safeRole,
      university, branch, cgpa,
      skills: parsedSkills,
      companyName, industry, website,
      authProvider: "local",
    };

    if (req.file) {
      userData.profilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   POST /api/auth/login ─────────────────────────────────────────────
// ── @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Need +password since it's select:false on the model
    const user = await User.findOne({ email }).select("+password +authProvider");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google login. Please continue with Google.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Unable to read Google email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const safeRole = role === "admin" ? "student" : (role || "student");
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        role: safeRole,
        authProvider: "google",
        googleId: payload.sub,
        profilePic: payload.picture || null,
      });
    } else if (user.authProvider === "local") {
      return res.status(400).json({
        success: false,
        message: "Account already exists with password login. Use email/password.",
      });
    }

    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: "Google login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Google authentication failed" });
  }
};

// ── @route   GET /api/auth/me ─────────────────────────────────────────────────
// ── @access  Private (any authenticated user)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   PUT /api/auth/profile ────────────────────────────────────────────
// ── @access  Private (any authenticated user)
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "university", "branch", "cgpa", "skills",
      "companyName", "industry", "website",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Handle profile picture upload
    if (req.file) {
      updates.profilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, googleLogin, getMe, updateProfile };
