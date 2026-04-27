const User = require("../models/user.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");

// ── @route   GET /api/admin/users ─────────────────────────────────────────────
// ── @access  Private – Admin only
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/admin/jobs ──────────────────────────────────────────────
// ── @access  Private – Admin only
const getAllJobsAdmin = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);
    const jobs  = await Job.find(filter)
      .populate("recruiterId", "name email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Attach applicant count
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicantCount: count };
      })
    );

    res.json({
      success: true,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      jobs: jobsWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   DELETE /api/admin/user/:id ──────────────────────────────────────
// ── @access  Private – Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    if (user.role === "recruiter") {
      // Delete all jobs and their applications belonging to this recruiter
      const recruiterJobs = await Job.find({ recruiterId: user._id }).select("_id");
      const jobIds = recruiterJobs.map((j) => j._id);
      await Application.deleteMany({ jobId: { $in: jobIds } });
      await Job.deleteMany({ recruiterId: user._id });
    }

    if (user.role === "student") {
      // Delete all applications by this student
      await Application.deleteMany({ studentId: user._id });
    }

    await user.deleteOne();

    res.json({ success: true, message: "User and all associated data deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   DELETE /api/admin/job/:id ───────────────────────────────────────
// ── @access  Private – Admin only
const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne();

    res.json({ success: true, message: "Job and all applications deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @route   GET /api/admin/stats ────────────────────────────────────────────
// ── @access  Private – Admin only
const getStats = async (req, res) => {
  try {
    const [totalStudents, totalRecruiters, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    const placedStudents = await Application.countDocuments({ status: "Offered" });

    const recentJobs  = await Job.find().sort({ createdAt: -1 }).limit(5).populate("recruiterId", "companyName");
    const recentUsers = await User.find({ role: "student" }).sort({ createdAt: -1 }).limit(5).select("-password");

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        placedStudents,
        placementRate: totalStudents > 0
          ? `${((placedStudents / totalStudents) * 100).toFixed(1)}%`
          : "0%",
      },
      recentJobs,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getAllJobsAdmin, deleteUser, deleteJobAdmin, getStats };
