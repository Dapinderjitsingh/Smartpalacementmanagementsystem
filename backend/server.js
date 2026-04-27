const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config();

const app = express();


app.use(helmet());


const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isLocalhostOrigin = (origin = "") =>
  /^https?:\/\/localhost(?::\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header), explicit allowlist,
      // and localhost with any port in development.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== "production" && isLocalhostOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth",         require("./routes/auth.routes"));
app.use("/api/jobs",         require("./routes/job.routes"));
app.use("/api/applications", require("./routes/application.routes"));
app.use("/api/admin",        require("./routes/admin.routes"));


app.get("/", (req, res) => {
  res.json({ message: "SmartPlacement API is running " });
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


app.use("/api/user", require("./routes/user.routes"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
