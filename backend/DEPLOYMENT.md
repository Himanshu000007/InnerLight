# InnerLight V2 - Deployment Guide

## Deployment Platforms

### Option 1: Render

1. **Create Account** on [Render.com](https://render.com)

2. **Connect GitHub** repository

3. **Create New Web Service**
   - Select GitHub repository
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**
   - Add all variables from `.env.example`

5. **Deploy**
   - Render auto-deploys on push to main

### Option 2: Railway

1. **Create Account** on [Railway.app](https://railway.app)

2. **New Project** → Connect GitHub repo

3. **Add Plugins**
   - MongoDB (for database)
   - Attach to project

4. **Environment Variables**
   - Add from `.env.example`

5. **Deploy** - Auto-deploys on push

### Option 3: Heroku

1. **Install Heroku CLI**
````bash
npm install -g heroku
````

2. **Login**
````bash
heroku login
````

3. **Create App**
````bash
heroku create innerlight-v2-api
````

4. **Set Environment Variables**
````bash
heroku config:set JWT_ACCESS_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongo_uri
# ... add all environment variables
````

5. **Deploy**
````bash
git push heroku main
````

## Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] MongoDB connection verified
- [ ] Email service configured
- [ ] Gemini API key added
- [ ] Cloudinary account setup
- [ ] Tests passing (`npm test`)
- [ ] No console errors/warnings
- [ ] Security headers enabled (Helmet)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Database indexes created

## Production Configuration

### Security

````javascript
// Ensure in production:
- HTTPS only
- Secure cookies (httpOnly, secure, sameSite)
- Rate limiting enabled
- CORS restricted to frontend domain
- No sensitive data in logs
- Password hashing (bcrypt)
- JWT token expiration
````

### Performance

````javascript
// Optimization:
- Enable compression
- Database connection pooling
- Cache frequently accessed data
- Use CDN for static assets
- Monitor database queries
- Setup monitoring/alerts
````

## Monitoring

### Recommended Tools

- **Error Tracking**: Sentry
- **Performance**: New Relic
- **Logs**: LogRocket
- **Uptime**: Pingdom
- **Analytics**: Google Analytics

## Database Backup

````bash
# MongoDB Atlas automatic backup
# Settings → Backup & Restore → Automatic Backup

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/innerlight_v2"

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" dump/
````

## Scaling

As traffic increases:

- Use MongoDB Atlas M2+ tier
- Enable read replicas
- Setup Redis for caching
- Use load balancing
- Monitor and optimize queries
- Implement API versioning