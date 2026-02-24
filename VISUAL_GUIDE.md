# Visual Quick Start Guide

## 🎯 Step-by-Step Setup

### Step 1: Initial Installation (2 minutes)
```
1. Open Terminal/Command Prompt
2. Navigate to: cd student
3. Run: npm run install-all
4. Wait for completion (~2-3 minutes)
```

### Step 2: Configure Environment (1 minute)
```
BACKEND:
1. Open: backend/.env
2. Keep defaults OR modify JWT_SECRET

FRONTEND:
1. Open: frontend/.env.local
2. Keep NEXT_PUBLIC_API_URL=http://localhost:5000/api
3. Keep NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Start Servers (1 minute)
```
From root directory:
npm run dev

You should see:
✓ Backend server running on http://localhost:5000
✓ Frontend server running on http://localhost:3000
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| Backend API | http://localhost:5000 | REST API |
| Health Check | http://localhost:5000/api/health | API status |

---

## 👤 User Workflows

### 💻 STUDENT WORKFLOW

```
START
  ↓
┌─────────────────────┐
│ Visit /register     │
└─────────────────────┘
  ↓
 Fill Form:
  • Email
  • Password
  • Name
  ↓
┌─────────────────────┐
│ Click Register      │
└─────────────────────┘
  ↓
Redirected to Login
  ↓
┌─────────────────────┐
│ Login with Email    │
│ & Password          │
└─────────────────────┘
  ↓
┌─────────────────────┐
│ → Dashboard         │
│   Options:          │
│   • My Profile      │
│   • My Courses      │
│   • Enroll          │
│   • View Grades     │
└─────────────────────┘
  ↓
STUDENT READY TO USE
```

### 🔐 ADMIN WORKFLOW

```
START
  ↓
Login with Admin Account
  ↓
┌──────────────────────┐
│ Admin Dashboard      │
│ Options:             │
│ • Manage Students    │
│ • Manage Courses     │
│ • Manage Grades      │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ MANAGE STUDENTS      │
├──────────────────────┤
│ • View all students  │
│ • Delete students    │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ MANAGE COURSES       │
├──────────────────────┤
│ • Create course      │
│ • Fill: Code/Name    │
│ • Set credits        │
│ • Delete course      │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ MANAGE ENROLLMENTS   │
├──────────────────────┤
│ • Update grades      │
│ • Remove enrollment  │
└──────────────────────┘
```

---

## 🗄️ Database Structure

```
┌─────────────────────────┐
│      USERS              │
├─────────────────────────┤
│ id (Primary Key)        │
│ email (Unique)          │
│ passwordHash            │
│ name                    │
│ role (student/admin)    │
│ createdAt               │
└────────────┬────────────┘
             │ (1:1)
             ↓
┌─────────────────────────┐
│     STUDENTS            │
├─────────────────────────┤
│ id (Primary Key)        │
│ userId (FK to Users)    │
│ rollNumber              │
│ dateOfBirth             │
│ phone                   │
│ address                 │
│ city, state, zipCode    │
│ enrollmentDate          │
└────────────┬────────────┘
             │ (M:M through)
             ↓
┌─────────────────────────┐
│   ENROLLMENTS (JT)      │
├─────────────────────────┤
│ id (Primary Key)        │
│ studentId (FK)          │
│ courseId (FK)           │
│ enrollmentDate          │
│ grade                   │
└────────────┬────────────┘
             │ (M:M)
             ↓
┌─────────────────────────┐
│     COURSES             │
├─────────────────────────┤
│ id (Primary Key)        │
│ code (Unique)           │
│ name                    │
│ description             │
│ credits                 │
│ createdAt               │
└─────────────────────────┘
```

---

## 🔌 API Request Examples

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Create Course (Admin)
```
POST http://localhost:5000/api/courses
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "code": "CS101",
  "name": "Intro to CS",
  "description": "Basic concepts",
  "credits": 3
}
```

### Enroll in Course
```
POST http://localhost:5000/api/enrollments
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1
}
```

---

## 🎨 Page Navigation Map

```
                    HOME (/)
                        │
            ┌───────────┼───────────┐
            │           │           │
        [GUEST]    [LOGIN PAGE]    [REGISTER]
            │           │              │
            └─────┬─────┴──────┬───────┘
                  │            │
            [USER LOGGED IN]
                  │
        ┌─────────┴──────────┐
        │                    │
    [STUDENT]            [ADMIN]
        │                    │
        ├─ DASHBOARD         ├─ DASHBOARD
        ├─ PROFILE           ├─ MANAGE STUDENTS
        ├─ COURSES           ├─ MANAGE COURSES
        ├─ ENROLLMENTS       ├─ MANAGE ENROLLMENTS
        └─ LOGOUT            └─ LOGOUT
```

---

## 🔒 Authentication Flow

```
┌────────┐
│ CLIENT │
└────┬───┘
     │ 1. Submit email/password
     ↓
┌──────────────┐
│ NEXTAUTH     │
└────┬─────────┘
     │ 2. Send to backend
     ↓
┌────────────────────┐
│ BACKEND            │
│ 1. Verify email    │
│ 2. Check password  │
│ 3. Create JWT      │
└────┬───────────────┘
     │ 4. Return token
     ↓
┌──────────────┐
│ NEXTAUTH     │
│ Store token  │
└────┬─────────┘
     │ 5. Set session
     ↓
┌────────┐
│ LOGGED │
│ IN ✓   │
└────────┘
     │ All requests include token
     ↓
┌────────────────────┐
│ BACKEND VALIDATES  │
│ TOKEN & RESPONDS   │
└────────┬───────────┘
     │
     ↓ Success/Failure
┌────────────┐
│ FRONTEND   │
│ Updates UI │
└────────────┘
```

---

## 📊 Feature Comparison

```
          ╔════════════╦═════════════╦════════╗
          ║  GUEST     ║  STUDENT    ║ ADMIN  ║
╠═════════╬════════════╬═════════════╬════════╣
║ Register║     ✓      ║      ✓      ║   ✓    ║
║ Login   ║     ✓      ║      ✓      ║   ✓    ║
║ Profile ║     ✗      ║      ✓      ║   ✓    ║
║ Courses ║     ✗      ║      ✓      ║   ✓    ║
║ Enroll  ║     ✗      ║      ✓      ║   ✗    ║
║ Grades  ║     ✗      ║      ✓      ║   ✓    ║
║ Manage  ║     ✗      ║      ✗      ║   ✓    ║
╚═════════╩════════════╩═════════════╩════════╝
```

---

## 🛠️ Troubleshooting Quick Guide

```
PROBLEM: "Port already in use"
SOLUTION: 
  • Backend: PORT=5001 npm run dev
  • Frontend: PORT=3001 npm run dev

PROBLEM: "Cannot connect to API"
SOLUTION:
  • Check backend is running (http://localhost:5000/api/health)
  • Check frontend NEXT_PUBLIC_API_URL matches

PROBLEM: "Database errors"
SOLUTION:
  • Delete backend/students.db
  • Restart backend

PROBLEM: "Login fails"
SOLUTION:
  • Clear browser cookies
  • Restart both servers
  • Verify email & password are correct

PROBLEM: "Styles not loading"
SOLUTION:
  • rm -rf frontend/.next
  • npm run dev
```

---

## 📱 Frontend Pages at a Glance

| Path | Component | Public | Auth Required |
|------|-----------|--------|---------------|
| `/` | Home | ✓ | - |
| `/login` | Login Form | ✓ | - |
| `/register` | Register Form | ✓ | - |
| `/dashboard` | Dashboard | ✗ | ✓ |
| `/profile` | Profile | ✗ | ✓ |
| `/courses` | Course List | ✗ | ✓ |
| `/enrollments` | Enrollments | ✗ | ✓ |
| `/admin/students` | Manage Students | ✗ | ✓ Admin |
| `/admin/courses` | Manage Courses | ✗ | ✓ Admin |
| `/admin/enrollments` | Manage Enrollments | ✗ | ✓ Admin |

---

## 🧪 Quick Test Cases

### Test 1: User Registration
```
1. Go to http://localhost:3000/register
2. Enter: email, password, name
3. Click Register
4. Should redirect to login
5. Status: ✓ PASS
```

### Test 2: User Login
```
1. Go to http://localhost:3000/login
2. Enter registered credentials
3. Click Login
4. Should see dashboard
5. Status: ✓ PASS
```

### Test 3: Enroll in Course
```
1. Login as student
2. Go to Courses
3. Click Enroll on any course
4. Check Enrollments page
5. Status: ✓ PASS
```

### Test 4: Admin Functions
```
1. Login as admin
2. Go to Manage Courses
3. Create new course
4. Go to Manage Students
5. List should show all students
6. Status: ✓ PASS
```

---

## 📦 Project Size

```
Backend:
  - Routes: 4 files (~600 lines)
  - Database: 1 file (~150 lines)
  - Middleware: 1 file (~50 lines)
  - Total: ~800 lines of code

Frontend:
  - Pages: 10 files (~2000 lines)
  - Components: 3 files (~300 lines)
  - Config: 4 files (~200 lines)
  - Total: ~2500 lines of code

Documentation:
  - 6 detailed guides (3000+ lines)
  - Complete API reference
  - Deployment guide
  - Architecture diagrams

TOTAL: ~6500 lines of code + documentation
```

---

## ⏰ Timeline

```
Total Setup Time: ~5 minutes
├─ Dependencies: 2-3 minutes
├─ Configuration: 1 minute
└─ Running servers: 1 minute

First Test:
├─ Register user: 30 seconds
├─ Login: 30 seconds
├─ Browse dashboard: 30 seconds
└─ Total: ~2 minutes
```

---

## 🎓 Learning Path

**Beginner Level**: Understand the project structure
**Intermediate Level**: Modify existing features
**Advanced Level**: Add new features and deploy
**Expert Level**: Refactor and optimize

---

**You're all set! Start with `npm run dev` 🚀**
