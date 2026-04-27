const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function requiredPassword() {
        return this.authProvider === "local";
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    // ── Student-specific fields ───────────────────────────────────────────────
    university: { type: String, trim: true },
    branch:     { type: String, trim: true },
    cgpa:       { type: Number, min: 0, max: 10 },
    skills:     [{ type: String, trim: true }],
    resumeURL:  { type: String }, // path to uploaded file or external URL
    profilePic: { type: String, default: null },

    // ── Recruiter-specific fields ─────────────────────────────────────────────
    companyName: { type: String, trim: true },
    industry:    { type: String, trim: true },
    website:     { type: String, trim: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
