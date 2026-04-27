const Job = require("../models/job.model");
const Application = require("../models/application.model");

// ── @route   POST /api/jobs ───────────────────────────────────────────────────
// ── @access  Private – Recruiter only
const createJob = async (req, res) => {
  try {
    const {
      title, description, salary, location,
      skills, workMode, jobType, openings, deadline,
    } = req.body;

    const job = await Job.create({
      title,
      company:     req.user.companyName || req.user.name,
      recruiterId: req.user._id,
      description,
      salary,
      location,
      skills:   Array.isArray(skills) ? skills : [],
      workMode: workMode || "Onsite",
      jobType:  jobType  || "Full-time",
      openings: openings || 1,
      deadline,
    });

    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/jobs ────────────────────────────────────────────────────
// ── @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { search, location, workMode, jobType, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: "i" } },
        { company:  { $regex: search, $options: "i" } },
        { skills:   { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (workMode) filter.workMode = workMode;
    if (jobType)  filter.jobType  = jobType;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);
    const jobs  = await Job.find(filter)
      .populate("recruiterId", "name email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/jobs/:id ────────────────────────────────────────────────
// ── @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name email companyName industry website"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   PUT /api/jobs/:id ────────────────────────────────────────────────
// ── @access  Private – Recruiter (owner only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only the recruiter who posted can edit it
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    const updatableFields = [
      "title", "description", "salary", "location",
      "skills", "workMode", "jobType", "openings", "deadline", "isActive",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json({ success: true, message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   DELETE /api/jobs/:id ─────────────────────────────────────────────
// ── @access  Private – Recruiter (owner) or Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const isOwner = job.recruiterId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    // Remove all applications for this job as well
    await Application.deleteMany({ jobId: job._id });

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/jobs/my ─────────────────────────────────────────────────
// ── @access  Private – Recruiter only
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

    // Attach applicant count to each job
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicantCount: count };
      })
    );

    res.json({ success: true, jobs: jobsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs };
