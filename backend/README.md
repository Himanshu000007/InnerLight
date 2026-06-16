# InnerLight V2 - Backend

Production-ready Mental Wellness Platform backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 Secure Authentication (JWT + OTP)
- 📱 Email Verification & Password Reset
- 📊 Mood Tracking & Analytics
- 📔 Journal Management
- 👥 Anonymous Community Posts
- 🤖 AI Wellness Assistant (Gemini)
- 📤 File Upload (Cloudinary)
- 🛡️ Security Best Practices
- ⚡ Rate Limiting
- 📝 Request Logging

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB Atlas Account
- Cloudinary Account
- Gemini API Key

### Installation

1. **Clone repository**
```bash
git clone <repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start development server**
```bash
npm run dev
```

Server runs on http://localhost:5000

## API Documentation

See `docs/swagger.js` for API documentation.

## Project Structure

## Testing

```bash
npm test
```

## Deployment

See `DEPLOYMENT.md` for production deployment guide.

## Security

- Helmet.js for HTTP headers
- Rate limiting on all endpoints
- XSS & NoSQL injection protection
- Bcrypt password hashing
- HttpOnly secure cookies
- CORS configuration
- Environment variable protection

## License

MIT

