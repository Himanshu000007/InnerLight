# InnerLight 🌿 - Mental Wellness Platform

A full-stack MERN application providing a safe, anonymous space for mental wellness and support.

## 📋 Project Overview

InnerLight is a mental wellness platform featuring:
- **Anonymous Sharing** - Share thoughts anonymously in a supportive community
- **Private Journal** - Track moods and thoughts privately
- **Calm Zone** - Guided breathing exercises
- **Relaxing Games** - Stress-free mini-games
- **Contact & Support** - Reach out for help

## 🏗 Architecture

- **Backend**: Node.js + Express + MongoDB Atlas
- **Frontend**: Vite + React + React Router
- **Authentication**: JWT + bcrypt
- **Database**: MongoDB Atlas (cloud)

## 📁 Project Structure

```
MentalHealth/
├── backend/          # Express API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/         # React application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React context (Auth)
    │   ├── pages/        # Page components
    │   ├── services/     # API service
    │   └── App.jsx       # Main app
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (free tier works)
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your MongoDB Atlas connection string
   - Generate and add JWT secret key
   - See `backend/README.md` for detailed instructions

4. Start backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Environment Variables Needed

### Backend (.env)

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env) - Optional

```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Frontend README](./frontend/README.md) - Frontend documentation

## 🎯 Features

### ✅ Implemented

- [x] User authentication (signup/login)
- [x] JWT token management
- [x] Anonymous post sharing
- [x] Reply to posts
- [x] Private journal with mood tracking
- [x] Breathing exercise (4-4-4 pattern)
- [x] Two relaxing games
- [x] Contact form
- [x] Protected routes
- [x] Responsive design
- [x] Pastel UI theme

## 🧪 Testing the Application

### Backend API

Test endpoints using:
- Postman
- Thunder Client (VS Code)
- curl
- Browser (GET requests)

Example:
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Frontend

1. Open `http://localhost:5173`
2. Sign up for a new account
3. Explore features:
   - Create anonymous posts
   - Write journal entries
   - Try breathing exercises
   - Play games
   - Contact support

## 🛠 Technologies

### Backend
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

### Frontend
- React 18
- React Router
- Axios
- Vite
- CSS3

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create post (protected)
- `GET /api/posts/:id` - Get post with replies
- `POST /api/posts/:id/reply` - Reply to post (protected)

### Journal
- `GET /api/journal` - Get user's entries (protected)
- `POST /api/journal` - Create entry (protected)
- `GET /api/journal/:id` - Get single entry (protected)

### Contact
- `POST /api/contact` - Submit contact form (public)

## 🎨 UI Design

- **Theme**: Pastel colors, soft gradients
- **Layout**: Split-screen login (UMS-inspired)
- **Navigation**: Fixed navbar with conditional links
- **Typography**: Poppins & Nunito fonts
- **Animations**: Smooth transitions and floating effects

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected routes on frontend
- Auth middleware on backend
- User IDs hidden in anonymous posts
- CORS configured

## 📱 Responsive

Works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Verify JWT_SECRET is set
- Check if port 5000 is available

**Frontend can't connect to backend:**
- Ensure backend is running
- Check CORS settings
- Verify API URL in frontend

**Authentication issues:**
- Clear localStorage
- Check token expiration (7 days)
- Verify JWT_SECRET matches

## 📄 License

ISC

## 🙏 Acknowledgments

- Design inspiration from LPU UMS
- Mental health support resources
- Open source community

---

**Remember**: This platform does not replace professional medical care. If you're in crisis, please contact emergency services or a mental health professional.
