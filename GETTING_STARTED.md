# Getting Started Guide

## 5-Minute Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

1. **Clone/Navigate to project:**
```bash
cd student
```

2. **Install all dependencies:**
```bash
npm run install-all
```

3. **Configure Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
```

4. **Configure Backend:**
```bash
cd ../backend
cp .env.example .env
```

5. **Start the application (from root):**
```bash
cd ..
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## User Walkthrough

### Student User Flow

#### 1. Register as a Student
```
1. Visit http://localhost:3000/register
2. Fill in form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
3. Click Register
4. Redirected to login page
```

#### 2. Login
```
1. Visit http://localhost:3000/login
2. Enter email: john@example.com
3. Enter password: password123
4. Click Login
5. Redirected to dashboard
```

#### 3. Complete Profile
```
1. From dashboard, click "My Profile"
2. Click Edit button
3. Fill in:
   - Date of Birth
   - Phone Number
   - Address
   - City, State, Zip Code
4. Click Save Changes
```

#### 4. Browse & Enroll in Courses
```
1. From dashboard, click "Available Courses"
2. View all available courses
3. Click "Enroll" on desired course
4. Get confirmation
```

#### 5. View Enrollments
```
1. From dashboard, click "My Enrollments"
2. See all enrolled courses
3. View grades (if graded by admin)
4. Can remove enrollment if needed
```

---

### Admin User Flow

**Note:** To create an admin, you need to manually set role in database or modify registration.

#### 1. Access Admin Dashboard
```
1. Login with admin account
2. Dashboard shows admin-specific options
```

#### 2. Create a Course
```
1. Click "Manage Courses" from navbar
2. Click "Create Course"
3. Fill in:
   - Course Code: CS101
   - Course Name: Intro to CS
   - Description: Basic concepts
   - Credits: 3
4. Click Create Course
```

#### 3. View All Students
```
1. Click "Manage Students" from navbar
2. See list of all registered students
3. Can delete students if needed
```

#### 4. Update Student Grades
```
1. Click "Manage Enrollments" from navbar
2. Update grades in the input field
3. Click Save to update
```

---

## API Usage Examples

### Using cURL

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Courses
```bash
curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Course (Admin)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "code": "CS101",
    "name": "Intro to CS",
    "description": "Basic concepts",
    "credits": 3
  }'
```

---

## Database

The SQLite database (`students.db`) is created automatically in the backend directory.

### Tables:
- **users** - User accounts
- **students** - Student profiles
- **courses** - Course catalog
- **enrollments** - Student-course relationships

### Reset Database
```bash
cd backend
rm students.db
npm run dev
```

This creates a fresh database on next startup.

---

## Troubleshooting

### "Cannot find module" errors
```bash
# In affected directory
rm -rf node_modules package-lock.json
npm install
```

### Port conflict
```bash
# Change backend port
PORT=5001 npm run dev

# Change frontend port (in separate terminal)
PORT=3001 npm run dev
```

### CORS errors
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Restart both servers

### Authentication fails
- Clear browser cookies
- Ensure both servers are running
- Check `.env` files are configured

### Database errors
- Delete `backend/students.db`
- Restart backend server

---

## Project Passwords & Secrets

### Generate Secure Secrets

**For development:**
```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use this for:
- `JWT_SECRET` in backend `.env`
- `NEXTAUTH_SECRET` in frontend `.env.local`

---

## Verification Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/api/health
- [ ] Can register a new account
- [ ] Can login with registered account
- [ ] Can view dashboard
- [ ] Can update profile
- [ ] Can enroll in courses (if courses exist)

---

## Next Steps

1. **Explore the code** - Review backend routes and frontend components
2. **Create test data** - Register users and courses
3. **Test workflows** - Try student and admin flows
4. **Add features** - Customize based on requirements
5. **Deploy** - Follow production deployment guide

---

## File Descriptions

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express app entry point |
| `database.js` | SQLite configuration |
| `middleware/auth.js` | JWT verification |
| `routes/users.js` | Authentication endpoints |
| `routes/students.js` | Student CRUD operations |
| `routes/courses.js` | Course management |
| `routes/enrollments.js` | Enrollment management |

### Frontend Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `app/login/page.tsx` | Login form |
| `app/register/page.tsx` | Registration form |
| `app/dashboard/page.tsx` | Main dashboard |
| `app/profile/page.tsx` | User profile |
| `components/Navbar.tsx` | Navigation |
| `app/api/auth/[...nextauth]/route.js` | Authentication |

---

## Support & Documentation

- **Main README:** See `README.md` for full documentation
- **Backend Docs:** See `backend/BACKEND_README.md`
- **Frontend Docs:** See `frontend/FRONTEND_README.md`

---

Happy coding! 🚀
