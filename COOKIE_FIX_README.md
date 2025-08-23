# LiveConnect Cookie Fix & Real-time Chat Implementation

## Issues Identified and Fixed

### 1. Cookie Configuration Problems
- **SameSite Setting**: Changed from `"strict"` to `"lax"` to allow cross-origin requests
- **Secure Flag**: Only set to `true` in production environment
- **Domain Setting**: Added proper domain configuration for production cookies

### 2. CORS Configuration
- Updated CORS settings to be more permissive
- Added proper environment detection for development vs production
- Included all necessary HTTP methods and headers

### 3. Socket.io Configuration
- Fixed CORS settings for WebSocket connections
- Added better error handling and connection management
- Improved transport fallback (websocket + polling)

### 4. Frontend Improvements
- Fixed axios configuration with proper environment detection
- Added request/response interceptors for better error handling
- Improved socket connection management
- Enhanced real-time messaging with proper event handling

## Key Changes Made

### Backend (`backend/src/`)

#### `lib/utils.js`
- Changed `sameSite: "strict"` to `sameSite: "lax"`
- Added proper domain configuration for production
- Fixed secure flag logic

#### `server.js`
- Enhanced CORS configuration with environment detection
- Added proper HTTP methods and headers
- Improved logging and error handling

#### `lib/socket.js`
- Updated CORS settings to match server configuration
- Added environment detection for proper origin handling

#### `controllers/auth.controller.js`
- Fixed logout function to properly clear cookies with same settings

#### `middlewares/auth.middleware.js`
- Added comprehensive logging for debugging cookie issues
- Improved error handling and JWT verification

### Frontend (`frontend/src/`)

#### `lib/axios.js`
- Fixed environment detection logic
- Added request/response interceptors
- Improved error handling and authentication flow

#### `store/useAuthStore.js`
- Enhanced socket connection management
- Added better error handling and logging
- Improved environment detection

#### `store/useChatStore.js`
- Enhanced real-time messaging functionality
- Added proper error handling and logging
- Improved message subscription management

#### `components/ChatContainer.jsx`
- Added data attributes for proper message scrolling
- Improved message display and user experience

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5003
NODE_ENV=development

# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Environment
The frontend automatically detects the environment using `import.meta.env.MODE`.

## Testing the Application

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Cookie Functionality
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Check Cookies section
4. Perform login/signup
5. Verify JWT cookie is set with proper attributes

### 4. Test Real-time Messaging
1. Open two browser windows/tabs
2. Login with different accounts
3. Start a conversation
4. Verify messages appear in real-time
5. Check socket connection status in console

## Debugging

### Backend Logs
- Check server console for authentication logs
- Look for cookie-related debug information
- Monitor socket connection events

### Frontend Logs
- Check browser console for API requests
- Monitor socket connection status
- Look for authentication flow logs

### Common Issues and Solutions

#### Cookies Not Being Sent
- Ensure `withCredentials: true` is set in axios
- Check CORS configuration matches frontend origin
- Verify cookie attributes (sameSite, secure, domain)

#### Socket Connection Issues
- Check CORS settings for WebSocket
- Verify environment detection is working
- Monitor socket connection events in console

#### Authentication Failures
- Check JWT_SECRET is properly set
- Verify cookie parsing middleware is loaded
- Monitor auth middleware logs

## Production Deployment

### Environment Variables
Set `NODE_ENV=production` in production environment.

### Cookie Settings
- `secure: true` will be automatically set
- `domain: ".liveconnect.pages.dev"` will be set for production
- `sameSite: "lax"` allows cross-origin requests while maintaining security

### CORS Origins
Production origins are automatically configured for:
- `https://liveconnect.pages.dev`
- `https://liveconnect-0wp5.onrender.com`

## Security Considerations

- `httpOnly: true` prevents XSS attacks
- `sameSite: "lax"` provides CSRF protection while allowing necessary cross-origin requests
- `secure: true` in production ensures cookies are only sent over HTTPS
- Proper CORS configuration prevents unauthorized access

## Performance Improvements

- Added request/response interceptors for better error handling
- Improved socket connection management with fallback transports
- Enhanced logging for debugging and monitoring
- Better error handling reduces unnecessary API calls
