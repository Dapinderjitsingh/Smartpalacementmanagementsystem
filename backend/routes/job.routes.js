const express = require("express");
const router = express.Router();
const {
  createJob, getAllJobs, getJobById,
  updateJob, deleteJob, getMyJobs,
} = require("../controllers/job.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public routes
router.get("/",     getAllJobs);
router.get("/:id",  getJobById);

// Recruiter-only routes
router.post(  "/",      protect, authorize("recruiter"), createJob);
router.get(   "/my/listings", protect, authorize("recruiter"), getMyJobs);
router.put(   "/:id",   protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id",   protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;
