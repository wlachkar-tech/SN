# Backend Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": { "id", "email", "name", "role" }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": { "id", "email", "name", "role" }
}
```

#### Get User Profile
```
GET /auth/profile
Authorization: Bearer <jwt-token>

Response:
{
  "user": { "id", "email", "name", "role" },
  "student": { "id", "userId", "rollNumber", ... }
}
```

### Student Endpoints

#### Create Student Profile
```
POST /students
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rollNumber": "STU001",
  "dateOfBirth": "2000-01-01",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "enrollmentDate": "2024-01-15"
}
```

#### Get All Students (Admin Only)
```
GET /students
Authorization: Bearer <admin-jwt-token>
```

#### Get Student by ID
```
GET /students/:id
Authorization: Bearer <jwt-token>
```

#### Update Student
```
PUT /students/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "dateOfBirth": "2000-01-01",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

#### Delete Student (Admin Only)
```
DELETE /students/:id
Authorization: Bearer <admin-jwt-token>
```

### Course Endpoints

#### Create Course (Admin Only)
```
POST /courses
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "code": "CS101",
  "name": "Introduction to Computer Science",
  "description": "Basic concepts of CS",
  "credits": 3
}
```

#### Get All Courses
```
GET /courses
Authorization: Bearer <jwt-token>
```

#### Get Course by ID
```
GET /courses/:id
Authorization: Bearer <jwt-token>
```

#### Update Course (Admin Only)
```
PUT /courses/:id
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Advanced CS",
  "description": "Updated description",
  "credits": 4
}
```

#### Delete Course (Admin Only)
```
DELETE /courses/:id
Authorization: Bearer <admin-jwt-token>
```

### Enrollment Endpoints

#### Get Student Enrollments
```
GET /enrollments/student/:studentId
Authorization: Bearer <jwt-token>

Response:
[
  {
    "id": 1,
    "courseId": 1,
    "code": "CS101",
    "name": "Course Name",
    "credits": 3,
    "grade": "A"
  }
]
```

#### Enroll in Course
```
POST /enrollments
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1,
  "enrollmentDate": "2024-01-15"
}
```

#### Update Grade (Admin Only)
```
PUT /enrollments/:id
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "grade": "A"
}
```

#### Remove Enrollment
```
DELETE /enrollments/:id
Authorization: Bearer <jwt-token>
```

## Database

The application uses SQLite. Database file: `students.db`

### Reset Database
```bash
rm students.db
npm start
```

This will recreate the database with empty tables on next start.

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Notes

- JWT tokens expire in 7 days
- Passwords are hashed using bcryptjs
- All sensitive endpoints require authentication
- Admin-only endpoints check user role
- CORS is enabled for frontend

## Development

### File Structure
```
backend/
├── database.js       - Database configuration
├── server.js         - Express app setup
├── middleware/
│   └── auth.js      - Authentication middleware
├── routes/
│   ├── users.js     - Auth routes
│   ├── students.js  - Student routes
│   ├── courses.js   - Course routes
│   └── enrollments.js - Enrollment routes
├── package.json
└── .env
```

### Adding Middleware
Middleware is added in `server.js`:
```javascript
app.use(authMiddleware);
```

### Adding Routes
Routes are modular in the `routes/` directory and imported in `server.js`.

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Enable HTTPS
4. Configure CORS for your frontend domain
5. Use environment variables for all config
6. Enable proper logging

Example: `NODE_ENV=production JWT_SECRET=<secure-random-key> PORT=5000 npm start`
