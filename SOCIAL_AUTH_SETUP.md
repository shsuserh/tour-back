# Social Authentication Setup Guide

## Overview
This implementation adds social authentication support for Google, Facebook, and Instagram to your existing authentication system.

## Environment Variables
Add the following variables to your `.env` file:

```env
# Backend and Frontend URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Google OAuth Configuration
# Get these from: https://console.developers.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth Configuration  
# Get these from: https://developers.facebook.com/
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Instagram OAuth Configuration
# Get these from: https://developers.facebook.com/ (Instagram is part of Facebook)
INSTAGRAM_CLIENT_ID=your_instagram_client_id_here
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret_here
```

## OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Set valid OAuth redirect URIs:
   - `http://localhost:3000/auth/facebook/callback` (development)
   - `https://yourdomain.com/auth/facebook/callback` (production)

### Instagram OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" product
4. Set valid OAuth redirect URIs:
   - `http://localhost:3000/auth/instagram/callback` (development)
   - `https://yourdomain.com/auth/instagram/callback` (production)

## API Endpoints

### Authentication Endpoints
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Initiate Facebook OAuth
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /auth/instagram` - Initiate Instagram OAuth
- `GET /auth/instagram/callback` - Instagram OAuth callback

### Social Account Management
- `GET /auth/social/linked` - Get user's linked social accounts (requires authentication)
- `DELETE /auth/social/unlink/:provider` - Unlink social account (requires authentication)

## Database Migration
Run the migration to create the social_auth table:
```bash
npm run migration:run
```

## Frontend Integration
The OAuth flow redirects to your frontend with tokens:
```
FRONTEND_URL/auth/callback?accessToken=...&refreshToken=...
```

Handle the callback in your frontend to store the tokens and redirect to the main app.

## Features
- ✅ Google OAuth authentication
- ✅ Facebook OAuth authentication  
- ✅ Instagram OAuth authentication
- ✅ Automatic user creation for new social users
- ✅ Linking social accounts to existing users
- ✅ Social account management (view/unlink)
- ✅ JWT token generation for social users
- ✅ Database migration for social auth data
- ✅ Swagger documentation for all endpoints
