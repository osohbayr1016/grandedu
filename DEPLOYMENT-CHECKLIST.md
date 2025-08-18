# GrandEdu Deployment Checklist

## Admin Editing Issues - Fixes Applied

### 1. Backend CORS Configuration ✅

- **Issue**: Basic CORS configuration may not work in production
- **Fix**: Updated `backend/src/server.ts` with specific origins and credentials
- **Location**: Lines 18-31

### 2. Authentication Middleware Enhancement ✅

- **Issue**: Poor error handling and debugging in auth middleware
- **Fix**: Enhanced `backend/src/middleware/auth.ts` with better logging and error messages
- **Location**: Complete file rewrite

### 3. API URL Resolution ✅

- **Issue**: API URL determination logic inconsistent in production
- **Fix**: Updated `frontend/src/utils/api.ts` with more robust hostname checking
- **Location**: Lines 33-58

### 4. Authenticated Request Utility ✅

- **Issue**: Inconsistent authentication handling across admin functions
- **Fix**: Added `authenticatedFetch` utility in `frontend/src/utils/api.ts`
- **Location**: Lines 163-209

### 5. Admin Page Error Handling ✅

- **Issue**: Poor error handling in admin operations
- **Fix**: Updated key functions in `frontend/src/app/admin/page.tsx` to use `authenticatedFetch`
- **Functions Updated**: `saveContent`, `fetchContent`, `handleSaveUniversity`

## Deployment Steps

### Backend Deployment (Render.com)

1. **Environment Variables** - Ensure these are set in Render:

   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DATABASE_URL=your-postgresql-connection-string
   PORT=5001
   ```

2. **Build Command**: `yarn install && npx prisma generate && npx prisma db push`
3. **Start Command**: `yarn start`

### Frontend Deployment (Vercel)

1. **Environment Variables** - Not required with current setup
2. **Build Command**: Default Next.js build
3. **Framework Preset**: Next.js

## Troubleshooting Guide

### If Admin Editing Still Fails:

1. **Check Browser Console**:

   - Run the debug script: `/debug-deployment.js`
   - Copy the script content into browser console on admin page

2. **Verify Authentication**:

   ```javascript
   // Check in browser console
   console.log("Token:", localStorage.getItem("token"));
   console.log("User:", localStorage.getItem("user"));
   ```

3. **Test Backend Directly**:

   ```bash
   curl https://grandedu-g5yo.onrender.com/api/health
   ```

4. **Check Backend Logs**:
   - Go to Render dashboard
   - Check application logs for errors

### Common Issues & Solutions:

1. **401 Unauthorized Errors**:

   - Token expired: Re-login to admin
   - JWT_SECRET mismatch: Check environment variable

2. **CORS Errors**:

   - Add your domain to CORS origins in backend
   - Check if frontend domain matches CORS configuration

3. **Network Errors**:

   - Backend not responding: Check Render deployment status
   - Database connection: Verify DATABASE_URL

4. **Environment-Specific Issues**:
   - Clear browser cache and localStorage
   - Try incognito/private browsing mode

## Testing Steps

1. **Login to Admin**:

   - Visit deployed frontend
   - Login with admin credentials
   - Navigate to `/admin`

2. **Test Each Section**:

   - Content editing
   - University management
   - Program management
   - News management
   - User management

3. **Verify Persistence**:
   - Make changes
   - Refresh page
   - Confirm changes are saved

## Monitoring

- **Backend Health**: https://grandedu-g5yo.onrender.com/api/health
- **Backend Logs**: Render dashboard
- **Frontend**: Browser developer tools

## Recovery Steps

If issues persist:

1. **Redeploy Backend**:

   - Force new deployment in Render
   - Check environment variables

2. **Redeploy Frontend**:

   - Force new deployment in Vercel
   - Clear build cache

3. **Database Reset** (Last Resort):
   - Run seed script to recreate admin user
   - Reset all content to defaults
