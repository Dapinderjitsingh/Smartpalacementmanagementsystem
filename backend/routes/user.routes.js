const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { getProfile, getDashboard } = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/dashboard", protect, getDashboard);

module.exports = router;
