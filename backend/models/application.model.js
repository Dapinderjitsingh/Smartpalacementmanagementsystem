const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Interview Scheduled", "Offered"],
      default: "Pending",
    },
    resumeURL: {
      type: String, // path to uploaded resume at time of application
    },
    coverNote: {
      type: String,
      trim: true,
    },
    interviewDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent a student from applying to the same job twice
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
