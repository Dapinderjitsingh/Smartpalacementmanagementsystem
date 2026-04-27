const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.post("/register", upload.single("profilePic"), register);
router.post("/login",    login);
router.post("/google", googleLogin);

// Protected
router.get("/me",         protect, getMe);
router.put("/profile",    protect, upload.single("profilePic"), updateProfile);

module.exports = router;
