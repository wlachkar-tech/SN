# Architecture & Features Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Next.js Frontend (Port 3000)               │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  • React Components with TypeScript                      │  │
│  │  • NextAuth.js for Authentication                        │  │
│  │  • Tailwind CSS for Styling                              │  │
│  │  • Axios for API Communication                           │  │
│  │  • React Hot Toast for Notifications                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────────┘
                        │ HTTP/HTTPS
                        │ REST API
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Express.js Server (Port 5000)                  │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  • JWT Authentication Middleware                         │  │
│  │  • CORS Support                                          │  │
│  │  • RESTful API Endpoints                                 │  │
│  │  • Request Validation                                    │  │
│  │  • Error Handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ↑ SQL Queries ↓                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SQLite Database                             │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  • Users Table (Authentication & Profiles)               │  │
│  │  • Students Table (Student Information)                  │  │
│  │  • Courses Table (Course Catalog)                        │  │
│  │  • Enrollments Table (Student-Course Mapping)            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Action (FE)
    ↓
[NextAuth Session]
    ↓
[Request with JWT Token]
    ↓
Express Server
    ↓
[Verify JWT]
    ↓
[Check User Role]
    ↓
[Process Request]
    ↓
[Query/Modify Database]
    ↓
[Return Response]
    ↓
[Frontend Updates]
    ↓
Display to User
```

## Component Architecture

### Frontend Components

```
App
├── Providers
│   ├── SessionProvider (NextAuth)
│   └── Toaster (Notifications)
├── Navbar
│   ├── Navigation Links
│   ├── User Profile Display
│   └── Logout Button
├── ProtectedRoute
│   └── Redirect to Login if Unauthenticated
└── Pages
    ├── Public Pages
    │   ├── Home
    │   ├── Login
    │   └── Register
    ├── Student Pages
    │   ├── Dashboard
    │   ├── Profile
    │   ├── Courses
    │   └── Enrollments
    └── Admin Pages
        ├── Manage Students
        ├── Manage Courses
        └── Manage Enrollments
```

## Authentication Flow

```
┌─────────────┐
│   Register  │
└──────┬──────┘
       │
       ↓
┌──────────────────────────┐
│ Backend: Hash Password   │
│ Save to Database         │
└──────┬───────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│           Login Request                 │
│  Email: user@example.com                │
│  Password: ••••••••                     │
└──────┬────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│   Backend: Verify Credentials            │
│   - Find user by email                   │
│   - Compare password hash                │
└──────┬───────────────────────────────────┘
       │
       ↓ (if valid)
┌────────────────────────────────────────┐
│  Generate JWT Token                    │
│  - User ID                             │
│  - Email                               │
│  - Role                                │
│  - Expiry (7 days)                     │
└──────┬─────────────────────────────────┘
       │
       ↓
┌────────────────────────────────────────┐
│  NextAuth: Store in Session            │
│  - Token                               │
│  - User Info                           │
└──────┬─────────────────────────────────┘
       │
       ↓
┌────────────────────────────────────────┐
│  Frontend: Authenticated ✓             │
│  - Access Protected Routes             │
│  - Send Token with Requests            │
└────────────────────────────────────────┘
```

## Feature Matrix

### User Roles & Permissions

| Feature | Student | Admin | Guest |
|---------|---------|-------|-------|
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| View Profile | ✅ | ✅ | ❌ |
| Edit Profile | ✅ | ✅ | ❌ |
| View Courses | ✅ | ✅ | ❌ |
| Create Course | ❌ | ✅ | ❌ |
| Enroll in Course | ✅ | ❌ | ❌ |
| View Enrollments | ✅ | ❌ | ❌ |
| View Grades | ✅ | ✅ | ❌ |
| Update Grades | ❌ | ✅ | ❌ |
| View All Students | ❌ | ✅ | ❌ |
| Delete Student | ❌ | ✅ | ❌ |
| Delete Course | ❌ | ✅ | ❌ |
| Manage Enrollments | ❌ | ✅ | ❌ |

## API Endpoint Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── GET /profile (Protected)
│   └── GET /all (Admin)
├── /students
│   ├── POST / (Protected)
│   ├── GET / (Admin)
│   ├── GET /:id (Protected)
│   ├── PUT /:id (Protected)
│   └── DELETE /:id (Admin)
├── /courses
│   ├── POST / (Admin)
│   ├── GET / (Protected)
│   ├── GET /:id (Protected)
│   ├── PUT /:id (Admin)
│   └── DELETE /:id (Admin)
└── /enrollments
    ├── POST / (Protected)
    ├── GET /student/:studentId (Protected)
    ├── PUT /:id (Admin - Update Grade)
    └── DELETE /:id (Protected)
```

## Database Schema Relationships

```
Users (1) ──── (1) Students
  │
  ├─ id
  ├─ email
  ├─ passwordHash
  ├─ name
  ├─ role (student/admin)
  └─ createdAt

Students (M) ──── (M) Courses
  │                   │
  ├─ id             ├─ id
  ├─ userId (FK)    ├─ code
  ├─ rollNumber     ├─ name
  ├─ dateOfBirth    ├─ description
  ├─ phone          ├─ credits
  ├─ address        └─ createdAt
  ├─ city
  ├─ state
  ├─ zipCode
  └─ enrollmentDate

                    ↓ Through ↓

              Enrollments (Junction)
                    │
                    ├─ id
                    ├─ studentId (FK)
                    ├─ courseId (FK)
                    ├─ enrollmentDate
                    ├─ grade
                    └─ createdAt
```

## Security Layers

```
┌────────────────────────────────────────┐
│         Security Stack                 │
├────────────────────────────────────────┤
│ 1. HTTPS/TLS                           │
│    - Encrypted data in transit         │
├────────────────────────────────────────┤
│ 2. Password Hashing (bcryptjs)         │
│    - Secure password storage           │
├────────────────────────────────────────┤
│ 3. JWT Authentication                  │
│    - Stateless session management      │
├────────────────────────────────────────┤
│ 4. CORS                                │
│    - Control cross-origin access       │
├────────────────────────────────────────┤
│ 5. Role-Based Access Control           │
│    - Student vs Admin restrictions     │
├────────────────────────────────────────┤
│ 6. Input Validation                    │
│    - Prevent injection attacks         │
├────────────────────────────────────────┤
│ 7. Environment Variables               │
│    - Sensitive data protection         │
└────────────────────────────────────────┘
```

## Frontend Request Flow

```
1. User Action
   └─ Click Button / Submit Form
                │
                ↓
2. Form Validation (Client-side)
   └─ Check required fields, format
                │
                ↓
3. Get Session
   └─ Retrieve JWT token from NextAuth
                │
                ↓
4. Make API Request
   └─ axios.get/post/put/delete
   └─ Include Authorization header
                │
                ↓
5. Backend Processing
   └─ Verify token
   └─ Validate request
   └─ Process business logic
                │
                ↓
6. Response Handler
   └─ Check status code
   └─ Handle errors
   └─ Update UI state
                │
                ↓
7. Display Result
   └─ Toast notification
   └─ Update component state
   └─ Redirect if needed
```

## Error Handling Strategy

```
┌─────────────────────────────────────┐
│      Error Handling Flow            │
├─────────────────────────────────────┤
│ 1. API Request                      │
│    └─ Validate input                │
│                                     │
│ 2. Backend Receives Request         │
│    └─ Check authentication          │
│    └─ Validate authorization        │
│    └─ Sanitize input                │
│                                     │
│ 3. Database Operation               │
│    └─ Check constraints             │
│    └─ Handle conflicts              │
│    └─ Rollback on failure           │
│                                     │
│ 4. Error Response                   │
│    └─ HTTP Status Code              │
│    └─ Error Message                 │
│                                     │
│ 5. Frontend Handler                 │
│    └─ Check response                │
│    └─ Show user notification        │
│    └─ Log error                     │
│                                     │
│ 6. User Feedback                    │
│    └─ Toast message                 │
│    └─ Form error display            │
└─────────────────────────────────────┘
```

## Performance Considerations

- **Backend**: 
  - Database indexing on frequently queried fields
  - Connection pooling
  - Query optimization
  - Caching strategies (future enhancement)

- **Frontend**:
  - Code splitting
  - Lazy loading components
  - Image optimization
  - Memoization of components
  - Request debouncing

## Scalability Improvements (Future)

1. **Database**:
   - Migrate from SQLite to PostgreSQL
   - Add read replicas
   - Implement connection pooling

2. **Backend**:
   - Add caching layer (Redis)
   - Implement API rate limiting
   - Add background job queue

3. **Frontend**:
   - Implement service workers
   - Add offline support
   - Progressive Web App (PWA)

4. **Infrastructure**:
   - Docker containerization
   - Kubernetes orchestration
   - CDN for static assets
   - Load balancing
