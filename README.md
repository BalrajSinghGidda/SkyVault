# ☁️ SkyVault - Cloud Storage & File Sharing Platform

A full-stack cloud storage solution built with Node.js, Express, MongoDB, and vanilla JavaScript. Users can create accounts, upload/download files, share files with others, and track storage usage.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd SkyVault

# Install backend dependencies
cd backend
npm install

# Create .env file (already exists, update MONGO_URI if needed)
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/skyvault
# JWT_SECRET=super_secret_key_here
# MAX_FILE_SIZE=10485760

# Start backend server
npm run dev  # Development with nodemon
npm start    # Production

# In another terminal, open frontend
cd ../frontend
# Open index.html in browser or use a local server
python -m http.server 8000  # Python
npx http-server             # Node.js
```

Visit `http://localhost:8000` (or your server port) to access the frontend.

---

## 📁 Project Structure

```
SkyVault/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── File.js              # File metadata schema
│   │   │   ├── SharedFile.js        # File sharing schema
│   │   │   └── ActivityLog.js       # Activity logging schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── files.js             # File management endpoints
│   │   │   ├── sharing.js           # File sharing endpoints
│   │   │   └── dashboard.js         # Analytics endpoints
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   └── server.js                # Express server entry point
│   ├── uploads/                     # File storage directory
│   ├── .env                         # Environment variables
│   └── package.json
├── frontend/
│   ├── index.html                   # Landing page
│   ├── login.html                   # Login form
│   ├── register.html                # Registration form
│   ├── dashboard.html               # Main dashboard
│   ├── css/
│   │   └── style.css                # Styles
│   └── js/
│       └── auth.js                  # Auth utilities
├── docs/
│   ├── PLAN.md                      # Project plan
│   ├── api.md                       # API documentation
│   └── db-schema.md                 # Database schema
└── README.md                        # This file
```

---

## 🔐 API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```
Returns: `{ token, userId }`

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```
Returns: `{ token, userId, username }`

**GET** `/api/auth/me` (Protected)
Returns: Current user object

### File Management

**POST** `/api/files/upload` (Protected)
- Form data with `file` field
- Returns: `{ fileId }`

**GET** `/api/files` (Protected)
- Returns: Array of user's files

**GET** `/api/files/:id/download` (Protected)
- Downloads file by ID

**DELETE** `/api/files/:id` (Protected)
- Deletes file by ID

### File Sharing

**POST** `/api/share/:fileId` (Protected)
```json
{
  "sharedWith": "userId",
  "permission": "view|download|edit"
}
```

**POST** `/api/share/:fileId/link` (Protected)
```json
{
  "expiresIn": 7
}
```
Returns: `{ link, expiresAt }`

**GET** `/api/share/download/:token` (Public)
- Download via temporary share link

### Dashboard & Analytics

**GET** `/api/dashboard/storage` (Protected)
- Returns: `{ totalSize, maxStorage, usedPercentage, fileCount }`

**GET** `/api/dashboard/activity` (Protected)
- Returns: Recent activity logs (last 50)

---

## 🔑 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens expire in 7 days.

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Files Collection
```javascript
{
  _id: ObjectId,
  filename: String,
  userId: ObjectId (ref: User),
  size: Number,
  mimetype: String,
  filepath: String,
  createdAt: Date,
  updatedAt: Date
}
```

### SharedFiles Collection
```javascript
{
  _id: ObjectId,
  fileId: ObjectId (ref: File),
  sharedWith: ObjectId (ref: User),
  permission: String (view|download|edit),
  linkToken: String (optional),
  expiresAt: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLogs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: String (upload|download|delete|share),
  fileId: ObjectId (ref: File, optional),
  details: String,
  createdAt: Date
}
```

---

## 🛡️ Security Features

✅ **Password Hashing** - bcryptjs with 10 salt rounds
✅ **JWT Authentication** - 7-day expiring tokens
✅ **CORS** - Configured for cross-origin requests
✅ **Helmet** - Sets security HTTP headers
✅ **File Upload Limits** - Max 10MB per file (configurable)
✅ **Input Validation** - Email and username validation
✅ **Protected Routes** - JWT middleware on protected endpoints

### Future Enhancements
- [ ] Rate limiting on auth endpoints
- [ ] File type validation
- [ ] CSRF protection
- [ ] Request logging with Morgan
- [ ] Database indexing

---

## 🎨 Frontend Features

- **Landing Page** - Feature overview and CTA buttons
- **Registration** - Create new user account
- **Login** - Authenticate and receive JWT token
- **Dashboard** - Main application interface with:
  - File upload (drag-and-drop ready)
  - File listing with download/delete
  - Storage usage visualization
  - Recent activity log
  - Responsive design

---

## 📊 DBMS Concepts Implemented

| Concept | Implementation |
|---------|-----------------|
| **NoSQL** | MongoDB with Mongoose schemas |
| **Data Modeling** | User, File, SharedFile, ActivityLog collections |
| **Relationships** | User-File ownership, File-SharedFile sharing |
| **Indexing** | Unique indexes on email, username |
| **Aggregation** | Storage analytics with file size aggregation |
| **Authentication** | JWT tokens with bcrypt password hashing |
| **Authorization** | Role-based file access (owner, shared) |
| **Transactions** | File upload/delete operations |
| **Validation** | Schema-level and API-level input validation |
| **Scalability** | Cloud-ready architecture with MongoDB Atlas support |

---

## 🚀 Deployment

### Local Setup
```bash
# Start MongoDB
mongod --dbpath ./data/db

# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend server
cd frontend && npx http-server -p 8000
```

### Cloud Deployment

**Backend (Railway/Render):**
```bash
# Push to GitHub
git push origin main

# Connect repository to Railway/Render
# Set environment variables in deployment platform
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<strong_secret>
PORT=5000
```

**Frontend (Vercel/Netlify):**
```bash
# Deploy frontend/index.html and assets
# Update API_URL in frontend/dashboard.html to deployed backend URL
```

**Database (MongoDB Atlas):**
- Create MongoDB Atlas account
- Create a cluster and get connection URI
- Use URI in `MONGO_URI` environment variable

---

## 📝 Development

### Running Tests
```bash
# (Tests to be implemented)
npm test
```

### Code Style
- JavaScript (ES6+)
- Express conventions for backend
- Vanilla JS for frontend (no frameworks)

### Nodemon Development
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

---

## 🐛 Troubleshooting

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod --dbpath ./data/db`
- Check `MONGO_URI` in `.env`

**CORS Errors**
- Frontend and backend might be on different origins
- Update `cors()` in `server.js` if needed

**File Upload Fails**
- Check `MAX_FILE_SIZE` in `.env` (default: 10MB)
- Ensure `backend/uploads/` directory exists

**JWT Token Expired**
- Re-login to get a new token
- Token validity: 7 days

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 👨‍💻 Development Phases

- ✅ **Phase 1:** Project Setup
- ✅ **Phase 2:** Authentication System
- ✅ **Phase 3:** File Management
- ✅ **Phase 4:** File Sharing
- ✅ **Phase 5:** Dashboard & Analytics
- 🔄 **Phase 6:** Security Enhancements (in progress)
- 📋 **Phase 7:** Testing & Optimization (upcoming)
- 📋 **Optional:** Advanced Features (drag-drop, search, preview, etc.)

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Cloud Storage! ☁️✨**
