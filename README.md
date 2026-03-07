# 🎓 InternTrack — Student Internship & Placement Tracker

A full-stack web application to track internship applications, manage resumes, document interview experiences, and visualize career progress.

---

## 📁 Project Structure

```
internship-tracker/
├── backend/                  # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js             # MySQL connection pool
│   │   └── schema.sql        # Database schema
│   ├── controllers/          # Business logic
│   ├── middleware/           # JWT auth + Multer upload
│   ├── routes/               # Express route handlers
│   ├── uploads/              # Uploaded resume files
│   ├── .env                  # Environment variables
│   └── server.js             # Entry point
└── frontend/                 # React + Vite + Tailwind app
    └── src/
        ├── components/       # Layout, Sidebar, shared UI
        ├── context/          # Auth context
        ├── pages/            # All page components
        └── services/api.js   # Axios API layer
```

---

## 🛠️ Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+
- **npm** v9+

---

## 🚀 Setup Instructions

### 1. Clone / Navigate to Project

```bash
cd internship-tracker
```

### 2. Set Up MySQL Database

Open MySQL Workbench or your terminal and run:

```sql
SOURCE backend/config/schema.sql;
```

Or manually:
```bash
mysql -u root -p < backend/config/schema.sql
```

This creates the `internship_tracker` database with all required tables.

---

### 3. Backend Setup

```bash
cd backend
npm install
```

**Configure environment variables** — edit `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=internship_tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**Start the backend server:**

```bash
# Production
npm start

# Development (with auto-reload via nodemon)
npm run dev
```

The backend will run on: `http://localhost:5000`

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on: `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | Database name | `internship_tracker` |
| `JWT_SECRET` | JWT signing secret | `change_this_secret` |
| `PORT` | Backend port | `5000` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (Auth) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List all applications (with search/filter/sort) |
| GET | `/api/applications/stats` | Dashboard statistics |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

### Interview Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume` | List all resumes |
| POST | `/api/resume/upload` | Upload resume (PDF/DOC/DOCX, max 5MB) |
| GET | `/api/resume/download/:id` | Download resume |
| DELETE | `/api/resume/:id` | Delete resume |

---

## 🗄️ Database Schema

```sql
users           → id, name, email, password, created_at
applications    → id, user_id, company_name, job_role, location, application_date,
                  application_status, salary, job_link, notes
interview_notes → id, user_id, company, role, questions, experience, tips
resumes         → id, user_id, file_name, file_path, created_at
```

---

## ✨ Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Application Tracking** — CRUD with status (Applied, Shortlisted, Interview, Rejected, Offer)
- **Dashboard Analytics** — Doughnut chart (by status), Bar chart (per month) via Chart.js
- **Interview Notes** — Card-based notes with inline edit
- **Resume Manager** — Upload PDF/DOC/DOCX, download, delete
- **Job Dashboard** — Search, filter by status, sort by company or date
- **Dark Premium UI** — Glassmorphism, gradient accents, responsive sidebar layout

---

## 🌐 Deployment

To deploy on a cloud provider:

1. Set environment variables on the server
2. Ensure MySQL is reachable and schema is applied
3. Build frontend: `npm run build` → serve `dist/` folder with nginx/serve
4. Run backend with: `npm start` or use PM2: `pm2 start server.js`

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Chart.js |
| Backend | Node.js, Express.js |
| Database | MySQL 8 (mysql2 driver) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| HTTP Client | Axios |
