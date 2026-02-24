# Student Management Application

A complete full-stack Student Management System built with Node.js, Express, Next.js, SQLite, and NextAuth.

**🚀 Vercel-Ready**: Fully optimized for Vercel deployment with serverless API routes and zero cold-start issues.

## 🎯 Quick Start

### Deploy to Vercel (Recommended - 5 minutes)
1. Push code to GitHub (see QUICK_START.md)
2. Connect to Vercel
3. Set environment variables
4. Deploy → Done! ✅

**See:** [QUICK_START.md](QUICK_START.md) for step-by-step instructions.

## Features

### For Students
- ✅ User Registration and Authentication
- ✅ View and Update Profile Information
- ✅ Browse Available Courses
- ✅ Enroll in Courses
- ✅ View Enrolled Courses and Grades
- ✅ Manage Enrollments

### For Administrators
- ✅ Manage Student Information
- ✅ Create and Manage Courses
- ✅ Manage Student Enrollments
- ✅ Update Student Grades
- ✅ Delete Students and Courses

## Technology Stack

### Frontend (Vercel)
- **Next.js 14** - React framework with API routes
- **NextAuth** - Authentication (JWT-based)
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Axios** - HTTP client

### Backend (Standalone or Proxy)
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

## Project Structure

```
student/
├── frontend/                          # Next.js app (Vercel)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth setup
│   │   │   ├── students/              # API proxy routes
│   │   │   ├── courses/               # API proxy routes
│   │   │   └── enrollments/           # API proxy routes
│   │   ├── page.tsx (Home)
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── enrollments/
│   │   ├── courses/
│   │   └── admin/
│   ├── components/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── .env.local.example
│
├── backend/                           # Express (optional, for local/external)
│   ├── routes/
│   │   ├── users.js
│   │   ├── students.js
│   │   ├── courses.js
│   │   └── enrollments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── vercel.json                        # Vercel configuration
├── QUICK_START.md                     # Deployment guide
├── VERCEL_DEPLOYMENT.md               # Detailed Vercel setup
├── VERCEL_COMPATIBILITY.md            # Changes made for Vercel
└── README.md
```
- **Next.js 14** - React Framework
- **NextAuth.js** - Authentication
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Clone/Setup Project

```bash
cd student
```

### Step 2: Install Dependencies

#### Option A: Install all at once
```bash
npm run install-all
```

#### Option B: Install separately

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Frontend (.env.local):**
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Running the Application

### Development Mode

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend in development mode.

Alternatively, run them separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (Protected)
- `GET /auth/all` - Get all users (Admin only)

### Student Routes (`/api/students`)
- `POST /students` - Create student profile (Protected)
- `GET /students` - Get all students (Admin only)
- `GET /students/:id` - Get student by ID (Protected)
- `PUT /students/:id` - Update student (Protected)
- `DELETE /students/:id` - Delete student (Admin only)

### Course Routes (`/api/courses`)
- `POST /courses` - Create course (Admin only)
- `GET /courses` - Get all courses (Protected)
- `GET /courses/:id` - Get course by ID (Protected)
- `PUT /courses/:id` - Update course (Admin only)
- `DELETE /courses/:id` - Delete course (Admin only)

### Enrollment Routes (`/api/enrollments`)
- `POST /enrollments` - Enroll student (Protected)
- `GET /enrollments/student/:studentId` - Get student enrollments (Protected)
- `PUT /enrollments/:id` - Update grade (Admin only)
- `DELETE /enrollments/:id` - Remove enrollment (Protected)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER UNIQUE NOT NULL,
  rollNumber TEXT UNIQUE NOT NULL,
  dateOfBirth DATE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  enrollmentDate DATE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  enrollmentDate DATE,
  grade TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(studentId, courseId)
);
```

## User Roles & Permissions

### Student
- View own profile
- Update own profile
- Browse all courses
- Enroll in courses
- View own enrollments and grades
- Remove own enrollments

### Admin
- Create, read, update, delete courses
- View all students
- Delete students
- Update enrollment grades
- Full access to all features

## Test Credentials

After registration, you can login with your credentials. To create an admin account, modify the database directly or add an admin registration endpoint.

## Features Walkthrough

### 1. Registration
- Navigate to `/register`
- Fill in email, name, and password
- Click Register
- Automatically redirected to login

### 2. Login
- Navigate to `/login`
- Enter email and password
- Click Login
- Redirected to dashboard

### 3. Student Dashboard
- View personal information
- Browse available courses
- Enroll in courses
- View enrolled courses and grades

### 4. Admin Dashboard
- Manage students (view/delete)
- Create/manage courses
- View and update enrollments

## Production Deployment

### Backend (Heroku/Railway)
```bash
cd backend
npm install
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm install
npm run build
npm start
```

### Security Checklist
- [ ] Change JWT_SECRET to a secure random string
- [ ] Change NEXTAUTH_SECRET to a secure random string
- [ ] Remove .env files from version control (use .gitignore)
- [ ] Enable HTTPS only
- [ ] Set up CORS properly for production domain
- [ ] Use environment variables for all sensitive data
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up CSRF protection

## Troubleshooting

### Port Already in Use
If ports 3000 or 5000 are already in use:

**Backend:**
```bash
PORT=5001 npm run dev
```

**Frontend:**
```bash
PORT=3001 npm run dev
```

### Database Connection Error
- Ensure SQLite is properly installed
- Delete `students.db` to reset database
- Check file permissions in backend directory

### CORS Errors
- Ensure backend CORS is configured correctly
- Check NEXT_PUBLIC_API_URL in frontend .env.local
- Verify backend is running on correct port

### Authentication Issues
- Clear browser cookies
- Check token expiration (set to 7 days)
- Verify JWT_SECRET matches in backend .env

## Future Enhancements

- [ ] Email notifications
- [ ] Attendance tracking
- [ ] Assignment management
- [ ] GPA calculation
- [ ] Transcript generation
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Data export (PDF/CSV)
- [ ] Mobile application

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Last Updated:** February 2026
