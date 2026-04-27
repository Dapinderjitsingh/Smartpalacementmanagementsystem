# SmartPlacement Backend API

Node.js + Express + MongoDB REST API for the SmartPlacement campus placement portal.

---

## Folder Structure

```
backend/
├── config/
│   └── db.js                      # MongoDB connection
├── controllers/
│   ├── auth.controller.js         # Register, login, profile
│   ├── job.controller.js          # CRUD for jobs
│   ├── application.controller.js  # Apply, view, update status
│   └── admin.controller.js        # Admin operations
├── middleware/
│   ├── auth.middleware.js         # JWT protect + authorize
│   └── upload.middleware.js       # Multer resume upload
├── models/
│   ├── user.model.js              # User (student / recruiter / admin)
│   ├── job.model.js               # Job listing
│   └── application.model.js       # Job application
├── routes/
│   ├── auth.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   └── admin.routes.js
├── uploads/                       # Uploaded resumes (git-ignored)
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## Quick Start

```bash
# 1. Copy env file and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start dev server (requires nodemon)
npm run dev

# 4. Or start production server
npm start
```

---

## Environment Variables (.env)

| Variable        | Description                          | Example                              |
|-----------------|--------------------------------------|--------------------------------------|
| PORT            | Server port                          | 5000                                 |
| MONGO_URI       | MongoDB connection string            | mongodb://localhost:27017/smartplacement |
| JWT_SECRET      | Secret key for signing JWTs          | change_this_to_something_long        |
| JWT_EXPIRES_IN  | Token expiry duration                | 7d                                   |
| CLIENT_URL      | Frontend origin (CORS)               | http://localhost:5173                |

---

## API Reference

### Authentication

| Method | Route                  | Access  | Description              |
|--------|------------------------|---------|--------------------------|
| POST   | /api/auth/register     | Public  | Register student/recruiter |
| POST   | /api/auth/login        | Public  | Login and receive JWT    |
| GET    | /api/auth/me           | Private | Get logged-in user       |
| PUT    | /api/auth/profile      | Private | Update profile + resume  |

**Register body (student):**
```json
{
  "name": "Priya Sharma",
  "email": "priya@iitd.ac.in",
  "password": "secret123",
  "role": "student",
  "university": "IIT Delhi",
  "branch": "Computer Science",
  "cgpa": 9.2,
  "skills": ["React", "Node.js"]
}
```

**Register body (recruiter):**
```json
{
  "name": "HR Manager",
  "email": "hr@techcorp.com",
  "password": "secret123",
  "role": "recruiter",
  "companyName": "TechCorp",
  "industry": "Technology",
  "website": "https://techcorp.com"
}
```

**Login body:**
```json
{ "email": "priya@iitd.ac.in", "password": "secret123" }
```

**All protected routes require:**
```
Authorization: Bearer <token>
```

---

### Jobs

| Method | Route              | Access              | Description              |
|--------|--------------------|---------------------|--------------------------|
| GET    | /api/jobs          | Public              | List all active jobs     |
| GET    | /api/jobs/:id      | Public              | Get single job           |
| POST   | /api/jobs          | Recruiter           | Post a new job           |
| GET    | /api/jobs/my/listings | Recruiter        | Get recruiter's own jobs |
| PUT    | /api/jobs/:id      | Recruiter (owner)   | Update job               |
| DELETE | /api/jobs/:id      | Recruiter / Admin   | Delete job               |

**GET /api/jobs query params:**
- `search` — text search across title, company, skills
- `location` — filter by location
- `workMode` — Remote | Hybrid | Onsite
- `jobType` — Full-time | Internship | Part-time | Contract
- `page` — page number (default 1)
- `limit` — results per page (default 12)

**POST /api/jobs body:**
```json
{
  "title": "Frontend Developer",
  "description": "Build UIs with React...",
  "salary": "8-12 LPA",
  "location": "Bangalore",
  "skills": ["React", "TypeScript"],
  "workMode": "Hybrid",
  "jobType": "Full-time",
  "openings": 3,
  "deadline": "2026-04-30"
}
```

---

### Applications

| Method | Route                              | Access    | Description                      |
|--------|------------------------------------|-----------|----------------------------------|
| POST   | /api/applications/apply            | Student   | Apply for a job (+ resume upload)|
| GET    | /api/applications/student          | Student   | View own applications            |
| GET    | /api/applications/recruiter/all    | Recruiter | All applicants across all jobs   |
| GET    | /api/applications/recruiter/:jobId | Recruiter | Applicants for a specific job    |
| PUT    | /api/applications/status/:id       | Recruiter | Update applicant status          |

**POST /api/applications/apply** — multipart/form-data:
- `jobId` (string, required)
- `coverNote` (string, optional)
- `resume` (file, optional — PDF/DOC/DOCX, max 5MB)

**PUT /api/applications/status/:id body:**
```json
{
  "status": "Interview Scheduled",
  "interviewDate": "2026-03-15T10:00:00.000Z"
}
```

Valid status values: `Pending` | `Shortlisted` | `Rejected` | `Interview Scheduled` | `Offered`

---

### Admin

| Method | Route                  | Access | Description                      |
|--------|------------------------|--------|----------------------------------|
| GET    | /api/admin/stats       | Admin  | Platform stats + recent activity |
| GET    | /api/admin/users       | Admin  | All users (filterable by role)   |
| GET    | /api/admin/jobs        | Admin  | All jobs                         |
| DELETE | /api/admin/user/:id    | Admin  | Delete user + cascade data       |
| DELETE | /api/admin/job/:id     | Admin  | Delete job + all applications    |

**GET /api/admin/users query params:**
- `role` — student | recruiter | admin
- `search` — name or email
- `page`, `limit`

---

## Creating an Admin User

There is no public registration endpoint for admins. To seed the first admin:

```js
// Run once: node scripts/createAdmin.js
const mongoose = require("mongoose");
const User = require("./models/user.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({
    name: "Super Admin",
    email: "admin@smartplacement.com",
    password: "Admin@1234",
    role: "admin",
  });
  console.log("Admin created");
  process.exit();
});
```

---

## .gitignore

```
node_modules/
.env
uploads/
```
