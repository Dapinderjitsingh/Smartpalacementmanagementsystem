const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    skills: [{ type: String, trim: true }],
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Onsite",
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time", "Contract"],
      default: "Full-time",
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for fast text search on title, company, and skills
jobSchema.index({ title: "text", company: "text" });

module.exports = mongoose.model("Job", jobSchema);
