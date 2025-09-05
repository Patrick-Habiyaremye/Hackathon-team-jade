# Diaspora Bridge

A platform connecting Rwandan youth with diaspora mentors for guidance and mentorship.

## Features

### ✅ Completed Features

1. **Single Admin System**
   - Only one admin account can exist
   - Admin claim with email verification (`ndamukundavainqueur@gmail.com` + code `1234@`)
   - Admin dashboard for managing mentor applications
   - Admin routes protected and hidden from public

2. **Mentor Application & Approval Workflow**
   - Mentors apply through registration
   - Applications submitted to admin for review
   - Admin can approve/reject applications
   - Approved mentors become searchable
   - Notifications sent on approval/rejection

3. **Separate Role-Based Flows**
   - **Mentee Flow**: Register → Instant access to mentor search
   - **Mentor Flow**: Register → Submit application → Wait for approval → Manage requests
   - **Admin Flow**: Claim admin → Manage applications → Platform oversight

4. **Role-Based Login Redirects**
   - Mentees → Mentor search dashboard
   - Mentors → Request management dashboard
   - Admin → Admin dashboard

5. **Mentorship System**
   - Mentees can search and filter mentors
   - Request mentorship from specific mentors
   - Mentors can accept/reject requests
   - Real-time notifications for all actions

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Admin Access

To claim admin access:
1. Go to `/admin-claim`
2. Use email: `ndamukundavainqueur@gmail.com`
3. Use code: `1234@`

## User Flows

### For Mentees
1. Register as a mentee
2. Get instant access to mentor search
3. Browse and filter mentors by expertise
4. Send mentorship requests
5. Receive notifications on request status

### For Mentors
1. Register as a mentor
2. Submit application with detailed profile
3. Wait for admin approval
4. Once approved, manage incoming requests
5. Accept or reject mentorship requests

### For Admin
1. Claim admin access with special credentials
2. Review pending mentor applications
3. Approve or reject applications
4. Monitor platform activity

## Database Schema

The application uses a comprehensive database schema with:
- **Users**: Core user data with role-based access
- **MentorProfiles**: Detailed mentor information
- **MenteeProfiles**: Mentee goals and interests
- **MentorApplications**: Application tracking
- **MentorRequests**: Mentorship request system
- **Notifications**: Real-time user notifications

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/claim-admin` - Admin access claim
- `GET /api/auth/me` - Get current user

### Mentors
- `GET /api/mentors` - Get approved mentors

### Mentor Applications (Admin)
- `GET /api/admin/mentor-applications` - Get all applications
- `PATCH /api/admin/mentor-applications/[id]/approve` - Approve application
- `PATCH /api/admin/mentor-applications/[id]/reject` - Reject application

### Mentor Requests
- `GET /api/mentor-requests` - Get user's requests
- `POST /api/mentor-requests` - Send mentorship request
- `PATCH /api/mentor-requests/[id]/accept` - Accept request
- `PATCH /api/mentor-requests/[id]/reject` - Reject request

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/[id]/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Security Features

- JWT-based authentication
- Role-based access control
- Admin-only routes protection
- Password hashing with bcrypt
- Input validation and sanitization

## Production Considerations

For production deployment:

1. **Environment Variables**
   - Set secure JWT secret
   - Configure production database
   - Set up email service for notifications

2. **Database**
   - Migrate from SQLite to PostgreSQL/MySQL
   - Set up database backups

3. **Security**
   - Enable HTTPS
   - Set up rate limiting
   - Add CSRF protection
   - Implement proper error handling

4. **Monitoring**
   - Add logging
   - Set up error tracking
   - Monitor performance

## Contributing

This is a hackathon project built for connecting Rwandan youth with diaspora mentors. The codebase is designed to be production-ready with proper error handling, security measures, and scalable architecture.

## License

This project is part of a hackathon and is intended for educational and community purposes.