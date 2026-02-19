# InnerLight Frontend 🌿

Frontend application for the InnerLight mental wellness platform.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── PostCard.jsx   # Post display component
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Home page
│   │   ├── Login.jsx      # Login page (split layout)
│   │   ├── Signup.jsx    # Signup page (split layout)
│   │   ├── Share.jsx      # Anonymous sharing feed
│   │   ├── Journal.jsx    # Private journal
│   │   ├── Calm.jsx       # Breathing exercise
│   │   ├── Games.jsx      # Relaxing games
│   │   └── Contact.jsx    # Contact form
│   ├── services/
│   │   └── api.js         # API service with Axios
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Features

### Pages

1. **Home** - Welcome page with feature overview
2. **Login/Signup** - Split-screen layout inspired by UMS design
3. **Share** - Anonymous post feed (Quora-style)
4. **Journal** - Private mood-based journal entries (protected)
5. **Calm** - 4-4-4 breathing exercise (protected)
6. **Games** - Two relaxing mini-games:
   - Bubble Pop Relax
   - Color Match Calm
7. **Contact** - Contact form with helpline numbers

### Authentication

- JWT token stored in localStorage
- Automatic token attachment to API requests
- Protected routes for authenticated pages
- Auto-redirect on token expiration

### Design

- Pastel color palette
- Soft gradients and shadows
- Smooth animations
- Responsive design
- Accessible UI

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Key Technologies

- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling (no CSS framework)

## 🔐 Security

- JWT tokens stored securely in localStorage
- Protected routes require authentication
- API interceptors handle token refresh
- CORS configured for backend communication

## 📝 Notes

- All user IDs are hidden in anonymous posts/replies
- Journal entries are private to each user
- Games have no competitive scoring (relaxation-focused)
- Breathing exercise uses 4-4-4 pattern

## 🐛 Troubleshooting

**API connection errors:**
- Make sure backend is running on port 5000
- Check CORS settings in backend
- Verify API URL in `.env` file

**Authentication issues:**
- Clear localStorage and try logging in again
- Check if token is expired (7 days)
- Verify backend JWT_SECRET matches

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist .vite`

## ✅ Next Steps

1. Test all pages and features
2. Connect to backend API
3. Test authentication flow
4. Test protected routes
5. Test anonymous sharing
6. Test journal entries
7. Test games functionality
