# InnerLight Backend API 🌿

Backend API for the InnerLight mental wellness platform.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)
- npm or yarn

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Fill in your `.env` file with:

#### MongoDB Atlas Connection String

**How to get MongoDB Atlas connection string:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in (free tier is fine)
3. Create a new cluster (choose free M0 tier)
4. Wait for cluster to be created (~3-5 minutes)
5. Click **"Connect"** button
6. Choose **"Connect your application"**
7. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
8. Replace `<password>` with your database user password
9. Replace `<dbname>` (or add `?retryWrites=true&w=majority` after a database name) with `innerlight`
10. Paste it in `.env` as `MONGODB_URI`

**Example:**
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/innerlight?retryWrites=true&w=majority
```

**Important:** Make sure to:
- Create a database user in Atlas (Database Access → Add New Database User)
- Whitelist your IP address (Network Access → Add IP Address → Add Current IP Address)

#### JWT Secret Key

Generate a secure random secret key:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

**Option 3: Use any long random string** (at least 32 characters)

Paste the generated key in `.env` as `JWT_SECRET`

**Example:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

#### Port (Optional)

Default is 5000. Change if needed:
```
PORT=5000
```

#### CORS Origin (Optional)

Default is `http://localhost:5173` (Vite default). Update when frontend is ready:
```
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Signup, login, getMe
│   ├── postController.js   # Create post, get posts, reply
│   ├── journalController.js # Journal entries CRUD
│   └── contactController.js # Contact form submission
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema with password hashing
│   ├── Post.js            # Anonymous post schema
│   ├── Reply.js           # Anonymous reply schema
│   ├── Journal.js         # Private journal entry schema
│   └── Contact.js         # Contact form schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── postRoutes.js      # Post endpoints
│   ├── journalRoutes.js   # Journal endpoints
│   └── contactRoutes.js   # Contact endpoint
├── server.js              # Express app entry point
├── package.json
└── .env                   # Environment variables (not in git)
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth token)

### Posts (Anonymous Sharing)

- `GET /api/posts` - Get all posts (public feed)
- `POST /api/posts` - Create a post (requires auth)
  ```json
  {
    "content": "This is my anonymous post..."
  }
  ```
- `GET /api/posts/:id` - Get single post with replies
- `POST /api/posts/:id/reply` - Reply to a post (requires auth)
  ```json
  {
    "content": "This is my reply..."
  }
  ```

### Journal (Private)

- `POST /api/journal` - Create journal entry (requires auth)
  ```json
  {
    "mood": "Happy",
    "note": "Today was a great day..."
  }
  ```
- `GET /api/journal` - Get all journal entries for current user (requires auth)
- `GET /api/journal/:id` - Get single journal entry (requires auth)

### Contact

- `POST /api/contact` - Submit contact form (public)
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello, I need help..."
  }
  ```

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned when you signup or login.

## 🧪 Testing the API

You can test using:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl**
- **Browser** (for GET requests)

### Example: Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Example: Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Example: Test Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠 Technologies Used

- **Express.js** - Web framework
- **MongoDB** (via Mongoose) - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

## 📝 Notes

- All passwords are automatically hashed before saving (using bcrypt)
- User IDs are never exposed in post/reply responses (anonymous system)
- Journal entries are private to each user
- JWT tokens expire in 7 days
- Server runs on port 5000 by default

## 🐛 Troubleshooting

**MongoDB connection error:**
- Check your connection string in `.env`
- Verify your IP is whitelisted in MongoDB Atlas
- Check if your database user password is correct

**JWT errors:**
- Make sure `JWT_SECRET` is set in `.env`
- Verify token is being sent in Authorization header
- Check if token has expired (7 days)

**Port already in use:**
- Change `PORT` in `.env` to a different number
- Or stop the process using port 5000

## ✅ Next Steps

Once backend is working:
1. Test all endpoints
2. Set up frontend (Vite + React)
3. Connect frontend to backend API
4. Implement UI components
