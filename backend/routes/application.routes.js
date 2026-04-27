const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getStudentApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getAllRecruiterApplications,
} = require("../controllers/application.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Student routes
router.post("/apply",   protect, authorize("student"), upload.single("resume"), applyToJob);
router.get( "/student", protect, authorize("student"), getStudentApplications);

// Recruiter routes
router.get("/recruiter/all",      protect, authorize("recruiter"), getAllRecruiterApplications);
router.get("/recruiter/:jobId",   protect, authorize("recruiter"), getApplicantsForJob);
router.put("/status/:id",         protect, authorize("recruiter"), updateApplicationStatus);

module.exports = router;
