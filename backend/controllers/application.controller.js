const Application = require("../models/application.model");
const Job = require("../models/job.model");

// ── @route   POST /api/applications/apply ────────────────────────────────────
// ── @access  Private – Student only
const applyToJob = async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    // Check the job exists and is still active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: "Job not found or no longer active" });
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: "Application deadline has passed" });
    }

    // Check for duplicate application (the model index also enforces this)
    const existing = await Application.findOne({
      studentId: req.user._id,
      jobId,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    // Use resume uploaded now, or fall back to profile resume
    let resumeURL = req.user.resumeURL || null;
    if (req.file) {
      resumeURL = `/uploads/${req.file.filename}`;
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      coverNote,
      resumeURL,
    });

    await application.populate([
      { path: "jobId", select: "title company location salary" },
      { path: "studentId", select: "name email university" },
    ]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/applications/student ───────────────────────────────────
// ── @access  Private – Student only
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("jobId", "title company location salary skills workMode jobType deadline")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/applications/recruiter/:jobId ──────────────────────────
// ── @access  Private – Recruiter (owner of the job)
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view these applicants" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate(
        "studentId",
        "name email university branch cgpa skills resumeURL"
      )
      .sort({ createdAt: -1 });

    // Group counts by status for the recruiter's overview
    const statusSummary = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      job: { _id: job._id, title: job.title },
      total: applications.length,
      statusSummary,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   PUT /api/applications/status/:id ────────────────────────────────
// ── @access  Private – Recruiter (owner of the job)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate } = req.body;

    const validStatuses = ["Pending", "Shortlisted", "Rejected", "Interview Scheduled", "Offered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const application = await Application.findById(req.params.id).populate("jobId");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Confirm the requesting recruiter owns the job
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    if (status === "Interview Scheduled" && interviewDate) {
      application.interviewDate = new Date(interviewDate);
    }
    await application.save();

    await application.populate([
      { path: "studentId", select: "name email" },
      { path: "jobId",     select: "title company" },
    ]);

    res.json({ success: true, message: `Status updated to "${status}"`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/applications/recruiter/all ─────────────────────────────
// ── @access  Private – Recruiter (all their jobs)
const getAllRecruiterApplications = async (req, res) => {
  try {
    // Get all jobs belonging to this recruiter
    const Job = require("../models/job.model");
    const recruiterJobs = await Job.find({ recruiterId: req.user._id }).select("_id title");
    const jobIds = recruiterJobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("studentId", "name email university branch cgpa skills")
      .populate("jobId",     "title company location")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyToJob,
  getStudentApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getAllRecruiterApplications,
};
