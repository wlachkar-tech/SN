# Frontend Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.js          - NextAuth configuration
│   ├── page.tsx              - Home page
│   ├── login/page.tsx        - Login page
│   ├── register/page.tsx     - Registration page
│   ├── dashboard/page.tsx    - User dashboard
│   ├── profile/page.tsx      - User profile
│   ├── enrollments/page.tsx  - Enrollments page
│   ├── courses/page.tsx      - Courses page
│   ├── admin/
│   │   ├── students/page.tsx - Manage students
│   │   ├── courses/page.tsx  - Manage courses
│   │   └── enrollments/page.tsx - Manage enrollments
│   ├── layout.tsx            - Root layout
│   └── globals.css           - Global styles
├── components/
│   ├── Navbar.tsx            - Navigation bar
│   ├── ProtectedRoute.tsx    - Route protection
│   └── Providers.tsx         - App providers
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Pages

### Public Pages
- `/` - Home page
- `/login` - Login form
- `/register` - Registration form

### Protected Student Pages
- `/dashboard` - Student dashboard
- `/profile` - View/edit profile
- `/courses` - Browse available courses
- `/enrollments` - View enrolled courses

### Admin Pages (Role-based access)
- `/admin/students` - Manage all students
- `/admin/courses` - Create/manage courses
- `/admin/enrollments` - Manage grades

## Features

### Authentication
- NextAuth.js integration
- Credentials provider (email/password)
- JWT session strategy
- Automatic token refresh
- Protected routes

### Components

#### Navbar
- Navigation links
- User profile display
- Logout button
- Role-based menu items

#### ProtectedRoute
- Redirects unauthenticated users to login
- Shows loading state on initial load
- Prevents unauthorized access

#### Providers
- SessionProvider for NextAuth
- Toast notifications

### Styling
- Tailwind CSS for responsive design
- Custom global styles
- React Hot Toast for notifications

## Authentication Flow

1. User registers or logs in
2. Credentials sent to backend API
3. Backend validates and returns JWT
4. JWT stored in NextAuth session
5. Token included in API requests
6. Backend validates token for protected routes

## API Integration

All API calls use axios with JWT authentication:

```typescript
const response = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL}/endpoint`,
  {
    headers: {
      Authorization: `Bearer ${session?.token}`,
    },
  }
);
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generated secure string |
| `NEXTAUTH_URL` | Frontend URL | `http://localhost:3000` |

## Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## NextAuth Configuration

Located in `app/api/auth/[...nextauth]/route.js`:

- **Provider**: Credentials (email/password)
- **Callbacks**: JWT and Session callbacks
- **Session Strategy**: JWT
- **Max Age**: 7 days

### Adding OAuth Providers

To add OAuth (Google, GitHub, etc.):

```javascript
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
]
```

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling:

- Responsive design
- Dark mode support (can be enabled)
- Custom theme configuration in `tailwind.config.js`

## Common Issues

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### Session Not Persisting
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and cache
- Restart development server

### API Connection Errors
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` matches backend
- Check CORS configuration in backend

### Tailwind Styles Not Loading
```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

## Building for Production

```bash
npm run build
npm start
```

### Deployment Checklist
- [ ] Set `NEXTAUTH_SECRET` to secure random value
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update `NEXT_PUBLIC_API_URL` to production API
- [ ] Review authentication callbacks
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform

## Testing the Application

1. **Register a new user:**
   - Go to `/register`
   - Fill in email, name, password
   - Click Register

2. **Login:**
   - Go to `/login`
   - Use registered credentials
   - Should redirect to `/dashboard`

3. **Create student profile:**
   - Go to `/profile`
   - Click Edit
   - Fill in profile details
   - Save changes

4. **Enroll in courses:**
   - Go to `/courses`
   - Browse available courses
   - Click Enroll

5. **Admin functions:**
   - Create admin account (modify database)
   - Go to `/admin/students`
   - Manage students and courses

## Troubleshooting

### NextAuth Errors
- Check `.env.local` for required variables
- Verify backend token endpoint
- Check callback routes

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Type Errors
- Ensure TypeScript types are properly imported
- Check component prop types

## Performance Optimization

- Image optimization with Next.js Image
- Code splitting and lazy loading
- API response caching
- Database query optimization

## Security Best Practices

1. Never commit `.env.local` (add to `.gitignore`)
2. Use secure random for `NEXTAUTH_SECRET`
3. Validate all user inputs
4. Use HTTPS in production
5. Set secure cookie options in production
6. Implement rate limiting on API calls

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For issues or questions about the frontend, refer to the main README or contact the development team.
