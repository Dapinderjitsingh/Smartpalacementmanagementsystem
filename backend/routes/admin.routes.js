const express = require("express");
const router = express.Router();
const {
  getAllUsers, getAllJobsAdmin,
  deleteUser, deleteJobAdmin, getStats,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

router.get("/stats",        getStats);
router.get("/users",        getAllUsers);
router.get("/jobs",         getAllJobsAdmin);
router.delete("/user/:id",  deleteUser);
router.delete("/job/:id",   deleteJobAdmin);

module.exports = router;
