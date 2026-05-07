# SkyVault - Setup & Development Guide

## System Requirements

- **Node.js:** 18.0.0 or higher
- **MongoDB:** 5.0 or higher (local or Atlas)
- **npm:** 9.0.0 or higher
- **Git:** For version control
- **Modern Browser:** Chrome, Firefox, Safari, or Edge

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkyVault
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

This installs all required packages:
- express (web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- multer (file uploads)
- cors (cross-origin requests)
- helmet (security headers)
- morgan (HTTP logging)
- dotenv (environment variables)
- nodemon (development auto-reload)

#### 2.2 Configure Environment Variables

The `.env` file already exists with default values:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skyvault
JWT_SECRET=super_secret_key_here
MAX_FILE_SIZE=10485760
```

**For Production:**
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/skyvault
JWT_SECRET=your_very_secure_random_key_here
MAX_FILE_SIZE=10485760
NODE_ENV=production
```

#### 2.3 Setup MongoDB

**🐧 For NixOS Users:**
⚠️ MongoDB Community Edition is not available in NixOS nixpkgs.

👉 **See MONGODB_SETUP.md for detailed NixOS instructions!**

Quick options:
- Option 1: **MongoDB Atlas** (Recommended) - Free cloud database
- Option 2: **Docker** - Local MongoDB in container
- Option 3: **System package** - If available

---

**Local MongoDB (macOS/Linux with Homebrew):**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run in foreground
mongod --dbpath ./data/db
```

**Cloud MongoDB (Atlas - Works Everywhere):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/skyvault`
4. Update `MONGO_URI` in `.env`

**Docker (NixOS Friendly):**
```bash
docker run -d -p 27017:27017 --name skyvault-mongo mongo:latest
# Then use: MONGO_URI=mongodb://localhost:27017/skyvault
```

---#### 2.4 Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

---

### 3. Frontend Setup

#### 3.1 Serve Frontend Files

The frontend is pure HTML/CSS/JavaScript. Serve it using any method:

**Python (built-in):**
```bash
cd frontend
python -m http.server 8000
```

**Node.js (http-server):**
```bash
cd frontend
npx http-server -p 8000
```

**VS Code Live Server:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

**Direct File Access:**
- Open `frontend/index.html` in browser (limited functionality due to CORS)

Frontend runs on: `http://localhost:8000`

---

## Directory Structure Explained

```
SkyVault/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection setup
│   │   ├── models/            # Data schemas
│   │   │   ├── User.js        # User schema with password hashing
│   │   │   ├── File.js        # File metadata
│   │   │   ├── SharedFile.js  # Sharing permissions
│   │   │   └── ActivityLog.js # Activity tracking
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.js        # /api/auth/* routes
│   │   │   ├── files.js       # /api/files/* routes
│   │   │   ├── sharing.js     # /api/share/* routes
│   │   │   └── dashboard.js   # /api/dashboard/* routes
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication middleware
│   │   └── server.js          # Main Express app
│   ├── uploads/               # Uploaded files stored here
│   ├── .env                   # Environment configuration
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                  # HTML/CSS/JavaScript frontend
│   ├── index.html             # Landing page
│   ├── login.html             # Login form
│   ├── register.html          # Registration form
│   ├── dashboard.html         # Main application
│   ├── css/
│   │   └── style.css          # Global styles (responsive design)
│   └── js/
│       └── auth.js            # Auth helper functions
│
├── docs/                      # Documentation
│   ├── PLAN.md                # Project planning
│   ├── api.md                 # API endpoints
│   └── db-schema.md           # Database schema details
│
├── README.md                  # Project overview
└── flake.nix                  # Nix development environment
```

---

## Database Schema Overview

### Users
Stores user account information with hashed passwords.
```
_id, username, email, passwordHash, createdAt, updatedAt
```

### Files
Stores file metadata (actual files stored on disk).
```
_id, filename, userId, size, mimetype, filepath, createdAt, updatedAt
```

### SharedFiles
Tracks file sharing with permissions and temporary links.
```
_id, fileId, sharedWith, permission, linkToken, expiresAt, createdAt, updatedAt
```

### ActivityLogs
Tracks user actions for dashboard analytics.
```
_id, userId, action, fileId, details, createdAt
```

---

## Common Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Run specific file
node src/server.js
```

### MongoDB (CLI)
```bash
# Connect to local MongoDB
mongosh

# Show databases
show dbs

# Use SkyVault database
use skyvault

# Show collections
show collections

# View all users
db.users.find()

# Clear collection
db.files.deleteMany({})
```

### Testing Endpoints
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get user info (requires token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Feature Walkthrough

### 1. User Registration
- Navigate to `http://localhost:8000/register.html`
- Enter username, email, password
- Click "Register"
- Automatically logged in and redirected to dashboard

### 2. User Login
- Navigate to `http://localhost:8000/login.html`
- Enter email and password
- Click "Login"
- Redirected to dashboard

### 3. File Upload
- In dashboard, click "📤 Upload File"
- Select a file from your computer
- File is uploaded and stored in `backend/uploads/`
- File metadata saved to MongoDB

### 4. File Download
- In dashboard, click "⬇️ Download" next to file
- Browser downloads the file

### 5. File Deletion
- In dashboard, click "🗑️ Delete" next to file
- File removed from storage and database

### 6. Storage Analytics
- Dashboard displays current storage usage
- Shows MB used, total limit, percentage, file count
- Updates in real-time

### 7. Activity Logging
- Recent actions listed in activity section
- Tracks uploads, downloads, deletions, shares
- Shows timestamp for each action

---

## Troubleshooting

### Issue: "MongoDB Connection Failed"

**Solution 1: Start local MongoDB**
```bash
mongod --dbpath ./data/db
```

**Solution 2: Use MongoDB Atlas**
- Update `MONGO_URI` in `.env` with Atlas connection string
- Example: `mongodb+srv://user:password@cluster.mongodb.net/skyvault`

**Solution 3: Check connection string**
- Ensure MongoDB service is running
- Verify `MONGO_URI` format is correct
- Check network connectivity to MongoDB server

---

### Issue: "CORS Error" in browser console

**Cause:** Frontend and backend not properly configured for cross-origin

**Solution:**
- Frontend must be on different port than backend
- Backend has CORS enabled by default
- Check if requests use correct API URL: `http://localhost:5000/api/`

---

### Issue: "File upload fails" / "413 Payload Too Large"

**Cause:** File exceeds maximum size limit

**Solution:**
- Increase `MAX_FILE_SIZE` in `.env`
- Default: 10485760 bytes (10MB)
- Example for 50MB: `MAX_FILE_SIZE=52428800`
- Restart backend server

---

### Issue: "JWT Token Expired" / "401 Unauthorized"

**Cause:** Token validity expired (7 days)

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login again to get new token
- Token automatically stored in browser localStorage

---

### Issue: "Cannot find module" error

**Solution:**
```bash
cd backend
npm install
```

---

## Development Workflow

### Making Changes

1. **Backend Changes:**
   ```bash
   cd backend
   npm run dev  # Automatically restarts on file changes
   ```

2. **Frontend Changes:**
   - Simply save and refresh browser
   - Live Server auto-reloads

3. **Database Changes:**
   - MongoDB stores data persistently
   - Use MongoDB CLI to inspect data

### Testing

**Manual Testing via Frontend:**
- Use the UI in browser
- Check browser console for errors
- Check server logs for backend errors

**API Testing with cURL:**
```bash
# Get all files for user
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer <token>"
```

**Browser DevTools:**
- F12 to open developer console
- Network tab shows API requests
- Application tab shows localStorage

---

## Best Practices

1. **Security:**
   - Never commit `.env` with real secrets
   - Use strong `JWT_SECRET` in production
   - Keep dependencies updated

2. **File Management:**
   - Regularly backup `backend/uploads/` directory
   - Monitor disk space for file storage
   - Implement cleanup for old temporary share links

3. **Database:**
   - Use MongoDB Atlas for production
   - Enable backups and monitoring
   - Create indexes on frequently queried fields

4. **Code Style:**
   - Use consistent indentation (2 spaces)
   - Add comments for complex logic
   - Follow Express.js conventions

---

## Next Steps

1. ✅ Setup backend and frontend locally
2. ✅ Test user registration and login
3. ✅ Test file upload/download
4. ✅ Check storage analytics and activity logs
5. 📋 Deploy to production (Render + MongoDB Atlas)
6. 📋 Add advanced features (search, preview, notifications)
7. 📋 Implement security hardening
8. 📋 Add automated tests

---

## Getting Help

### Check Logs

**Backend logs:**
- Server logs show in terminal
- Check for "MongoDB Connection Failed" or other errors

**Browser logs:**
- Open DevTools (F12)
- Console tab shows JavaScript errors
- Network tab shows API errors with status codes

### Documentation
- Read `docs/api.md` for endpoint details
- Read `docs/db-schema.md` for database structure
- Check `README.md` for project overview

---

**Happy developing! ☁️✨**
