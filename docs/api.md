# SkyVault API Design

---

# Authentication

## Register

POST /api/auth/register

Body: { username, email, password }

---

## Login

POST /api/auth/login

Body: { email, password }

---

# Files

## Upload File

POST /api/files/upload

FormData:

- file

---

## Get User Files

GET /api/files

---

## Download File

GET /api/files/:id/download

---

## Delete File

DELETE /api/files/:id

---

# Sharing

## Share File

POST /api/share/:fileId

Body: { sharedWith, permission }

---

## Generate Temporary Link

POST /api/share/:fileId/link

---

# Dashboard

## Storage Analytics

GET /api/dashboard/storage

---

## Activity Logs

GET /api/dashboard/activity

````
---

# 📦 backend/package.json (Starter)

```json
{
  "name": "skyvault-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
````
