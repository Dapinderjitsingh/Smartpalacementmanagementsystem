# SmartPlacement — Campus Placement Portal

A full-stack monorepo containing the React + TypeScript **frontend** and the Node.js + Express + MongoDB **backend** for the SmartPlacement campus placement system.

---

## Project Structure

```
smartplacement/
├── frontend/          ← React + TypeScript + Vite + TailwindCSS + shadcn/ui
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts           ← All API calls + TypeScript types
│   │   ├── pages/
│   │   │   ├── student/         ← Dashboard, Jobs, Applied, Profile, Notifications
│   │   │   ├── company/         ← Dashboard, PostJob, ManageJobs, Applicants, Profile
│   │   │   └── admin/           ← Dashboard, Students, Companies, Jobs, Reports
│   │   ├── context/
│   │   │   └── JobApplicationContext.tsx
│   │   └── components/
│   └── package.json
│
├── backend/           ← Node.js + Express + MongoDB (Mongoose)
│   ├── config/db.js
│   ├── controllers/   ← auth, job, application, admin
│   ├── middleware/    ← JWT auth + Multer upload
│   ├── models/        ← User, Job, Application
│   ├── routes/        ← auth, job, application, admin
│   ├── uploads/       ← resume files (git-ignored)
│   └── server.js
│
├── package.json       ← Root scripts (runs both concurrently)
├── .env.example
└── .gitignore
```

---

## Quick Start

### 1. Clone & install everything

```bash
git clone <your-repo-url> smartplacement
cd smartplacement
npm run install:all
```

This installs root deps, frontend deps, and backend deps in one command.

### 2. Set up environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend (optional — defaults to http://localhost:5000/api)
cp frontend/.env.example frontend/.env
```

**backend/.env:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartplacement
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8080
NODE_ENV=development
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running locally:
```bash
mongod
# or via Homebrew on macOS:
brew services start mongodb-community
```

Or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster — just paste the connection string as `MONGO_URI`.

### 4. Run both servers

```bash
npm run dev
```

This starts:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:8080`

The Vite dev server proxies all `/api` and `/uploads` requests to the backend automatically.

Or run them separately:
```bash
npm run dev:backend    # backend only
npm run dev:frontend   # frontend only
```

---

## Test Credentials (after seeding)

| Role      | Email                        | Password   | Login hint              |
|-----------|------------------------------|------------|-------------------------|
| Student   | student@test.com             | test1234   | any email without keyword |
| Recruiter | company@techcorp.com         | test1234   | email contains "company" or "recruiter" |
| Admin     | admin@smartplacement.com     | Admin@1234 | email contains "admin"  |

> The **Login page** auto-routes based on email keyword — this is the existing frontend logic. In production, routing is determined by the `role` field returned from the API.

---

## Create an Admin User

There is no public admin registration. Run this one-time script:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({
    name: 'Super Admin',
    email: 'admin@smartplacement.com',
    password: 'Admin@1234',
    role: 'admin'
  });
  console.log('Admin created successfully');
  process.exit(0);
});
"
```

---

## API Overview

All API routes are prefixed with `/api`.

### Auth  (`/api/auth`)
| Method | Path           | Access  | Description              |
|--------|----------------|---------|--------------------------|
| POST   | /register      | Public  | Register student/recruiter |
| POST   | /login         | Public  | Get JWT token            |
| GET    | /me            | Private | Get current user         |
| PUT    | /profile       | Private | Update profile + resume  |

### Jobs  (`/api/jobs`)
| Method | Path              | Access            | Description           |
|--------|-------------------|-------------------|-----------------------|
| GET    | /                 | Public            | List jobs (paginated) |
| GET    | /:id              | Public            | Get single job        |
| POST   | /                 | Recruiter         | Post new job          |
| GET    | /my/listings      | Recruiter         | Own job listings      |
| PUT    | /:id              | Recruiter (owner) | Update job            |
| DELETE | /:id              | Recruiter / Admin | Delete job            |

### Applications  (`/api/applications`)
| Method | Path                    | Access    | Description                  |
|--------|-------------------------|-----------|------------------------------|
| POST   | /apply                  | Student   | Apply (with resume upload)   |
| GET    | /student                | Student   | View own applications        |
| GET    | /recruiter/all          | Recruiter | All apps across all jobs     |
| GET    | /recruiter/:jobId       | Recruiter | Apps for a specific job      |
| PUT    | /status/:id             | Recruiter | Update application status    |

### Admin  (`/api/admin`)
| Method | Path         | Access | Description                        |
|--------|--------------|--------|------------------------------------|
| GET    | /stats       | Admin  | Platform stats                     |
| GET    | /users       | Admin  | All users (filter by role/search)  |
| GET    | /jobs        | Admin  | All jobs                           |
| DELETE | /user/:id    | Admin  | Delete user + cascade              |
| DELETE | /job/:id     | Admin  | Delete job + all applications      |

---

## Frontend API Integration

The file `frontend/src/lib/api.ts` contains a full typed API client. To use it in any page:

```ts
import { jobsApi, authApi, applicationsApi } from "@/lib/api";

// Fetch jobs
const { jobs } = await jobsApi.getAll("?search=react&page=1");

// Login
const { token, user } = await authApi.login(email, password);

// Apply to a job
const formData = new FormData();
formData.append("jobId", job._id);
formData.append("resume", file);
await applicationsApi.apply(formData);

// Update applicant status (recruiter)
await applicationsApi.updateStatus(applicationId, "Shortlisted");
```

---

## Build for Production

```bash
# Build the frontend
npm run build
# Output is in frontend/dist/

# Start backend in production mode
npm run start:backend
```

To serve the frontend from the backend in production, add this to `backend/server.js`:
```js
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
```

---

## Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Framer Motion, Recharts |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer |
| Auth      | JWT (Bearer token), bcrypt password hashing       |
| File Upload | Multer (PDF/DOC/DOCX, max 5MB)                  |
