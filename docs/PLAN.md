# SkyVault — Development Plan

## 🎯 Objective

Build a cloud-based file storage and sharing platform where users can:

- Create accounts
- Upload/download files
- Share files with others
- Track storage usage
- Manage permissions

---

# 🧱 Phase 1 — Project Setup

## Tasks

- Initialize Git repository
- Setup Node.js + Express backend
- Connect MongoDB
- Create frontend structure
- Configure environment variables

## Deliverables

- Working Express server
- MongoDB connection
- Basic frontend pages

---

# 🔐 Phase 2 — Authentication System

## Features

- User registration
- User login
- Password hashing using bcrypt
- JWT/session authentication
- Protected routes

## Database Collections

- users

---

# 📂 Phase 3 — File Management

## Features

- File upload
- File download
- File deletion
- File metadata storage
- File size tracking

## Database Collections

- files

---

# 🤝 Phase 4 — File Sharing

## Features

- Share files with users
- Temporary share links
- Permission levels
  - View
  - Download
  - Edit

## Database Collections

- shared_files

---

# 📊 Phase 5 — Dashboard & Analytics

## Features

- Storage usage dashboard
- Upload statistics
- Recent activity logs
- File counters

## Database Collections

- activity_logs

---

# 🛡️ Phase 6 — Security Enhancements

## Features

- File type validation
- Rate limiting
- Secure JWT handling
- Protected uploads directory
- Input sanitization

---

# ✨ Optional Features

- Drag-and-drop uploads
- Folder hierarchy
- Search functionality
- Realtime notifications
- Dark mode
- File preview
- Multi-device sessions

---

# 🧠 DBMS Concepts Covered

| Concept       | Usage                        |
| ------------- | ---------------------------- |
| NoSQL         | MongoDB collections          |
| Relationships | User-file sharing            |
| Indexing      | Fast lookups                 |
| Aggregation   | Storage analytics            |
| Security      | Authentication & permissions |
| Scalability   | Cloud architecture           |
| Validation    | Schema enforcement           |
| Transactions  | File operations              |

---

# 🚀 Deployment Goals

## Local

- MongoDB local instance
- Node.js server

## Cloud (Optional)

- Render/Vercel frontend
- Railway backend
- MongoDB Atlas
