# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd Hackathon-team-jade
npm install
```

### 2. Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Go to [http://localhost:3000](http://localhost:3000)

## 🔑 Admin Access

To access the admin dashboard:
1. Go to [http://localhost:3000/admin-claim](http://localhost:3000/admin-claim)
2. Email: `ndamukundavainqueur@gmail.com`
3. Code: `1234@`

## 👥 Test the Platform

### Test Mentee Flow:
1. Go to [http://localhost:3000/register?type=mentee](http://localhost:3000/register?type=mentee)
2. Fill out the form
3. Login and browse mentors

### Test Mentor Flow:
1. Go to [http://localhost:3000/register?type=mentor](http://localhost:3000/register?type=mentor)
2. Fill out detailed mentor profile
3. Wait for admin approval (or approve yourself as admin)

### Test Admin Flow:
1. Claim admin access using the credentials above
2. Go to admin dashboard
3. Approve/reject mentor applications

## 🎯 Key Features Working

✅ **Single Admin System** - Only one admin, protected routes
✅ **Mentor Applications** - Submit, review, approve/reject
✅ **Role-Based Dashboards** - Different views for mentees, mentors, admin
✅ **Mentorship Requests** - Send, accept, reject requests
✅ **Real-time Notifications** - Get notified of all actions
✅ **Search & Filter** - Find mentors by expertise, location, etc.

## 🛠️ Production Ready

This is not a prototype - it's built for real-world use:
- Proper authentication & authorization
- Database relationships & constraints
- Error handling & validation
- Responsive design
- Security best practices
- Scalable architecture

## 📱 Mobile Friendly

The entire platform is responsive and works great on mobile devices.

---

**Ready to connect Rwandan youth with diaspora mentors! 🇷🇼**
