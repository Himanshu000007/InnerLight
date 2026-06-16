# InnerLight V2 API - Postman Collection Guide

## Setup

1. **Import Collection**
   - Download `InnerLight-API.postman_collection.json`
   - Postman → Import → Select file

2. **Environment Variables**
   - Create new environment: `InnerLight Dev`
   - Set variables:
     - `base_url`: `http://localhost:5000/api/v1`
     - `token`: (will be set automatically)
     - `refreshToken`: (will be set automatically)

## API Endpoints

### Authentication

**POST** `/auth/signup`
````json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
````

**POST** `/auth/login`
````json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
````

**POST** `/auth/send-otp`
````json
{
  "email": "john@example.com"
}
````

**POST** `/auth/verify-email`
````json
{
  "email": "john@example.com",
  "otp": "123456"
}
````

**POST** `/auth/forgot-password`
````json
{
  "email": "john@example.com"
}
````

**POST** `/auth/reset-password`
````json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPass123"
}
````

### Users

**GET** `/users/profile`
- Headers: Authorization: Bearer {token}

**PUT** `/users/profile`
````json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "bio": "Mental health advocate"
}
````

**POST** `/users/change-password`
````json
{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass456"
}
````

### Mood

**POST** `/moods`
````json
{
  "mood": "happy",
  "moodScore": 4,
  "intensity": "medium",
  "trigger": "Work meeting went well",
  "energy": 8,
  "sleep": 7
}
````

**GET** `/moods/history?page=1&limit=10`

**GET** `/moods/analytics?days=30`

**GET** `/moods/trend?days=7`

### Journal

**POST** `/journals`
````json
{
  "title": "My First Entry",
  "content": "Today was a great day...",
  "mood": "happy",
  "isPrivate": true
}
````

**GET** `/journals?page=1&limit=10`

**PUT** `/journals/{id}`
````json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
````

### Posts

**POST** `/posts`
````json
{
  "content": "Does anyone have tips for managing anxiety?",
  "category": "question",
  "tags": ["anxiety", "help"],
  "isAnonymous": true
}
````

**GET** `/posts?page=1&limit=10`

**GET** `/posts/search?q=anxiety`

**POST** `/posts/{id}/like`

**POST** `/posts/{id}/bookmark`

### Replies

**POST** `/replies/post/{postId}`
````json
{
  "content": "Here's what helps me...",
  "isAnonymous": true
}
````

**GET** `/replies/post/{postId}?page=1&limit=10`

### AI Assistant

**POST** `/ai/wellness`
````json
{
  "prompt": "I'm feeling stressed about work",
  "context": "Work deadline tomorrow"
}
````

**POST** `/ai/breathing-exercise`
````json
{
  "duration": 5,
  "focusArea": "anxiety"
}
````

### Contact

**POST** `/contacts`
````json
{
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Bug Report",
  "message": "I found a bug when...",
  "category": "bug_report"
}
````

### Admin

**GET** `/admin/dashboard`

**PUT** `/admin/users/{userId}`
````json
{
  "action": "suspend",
  "reason": "Violation of community guidelines"
}
````

## Testing Tips

1. **Token Management**
   - Store token from login in `{{token}}`
   - Refresh token auto-updates

2. **Test Flow**
   - Signup → Send OTP → Verify Email → Login
   - Create Mood → Get Analytics
   - Create Post → Add Reply → Like Reply

3. **Error Handling**
   - Test with invalid data
   - Test without authentication
   - Test with expired tokens

## cURL Examples

````bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'

# Create Mood
curl -X POST http://localhost:5000/api/v1/moods \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"mood":"happy","moodScore":4,"intensity":"medium"}'

# Get Profile
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer {token}"
````