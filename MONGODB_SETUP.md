# MongoDB Setup for NixOS - SkyVault

Since `mongodb-ce` is not available in NixOS stable repositories, use one of these approaches:

---

## 🎯 Option 1: MongoDB Atlas (RECOMMENDED ⭐)

**Pros:**
- ✅ No local setup needed
- ✅ Free tier (512MB storage)
- ✅ Cloud-hosted (scalable)
- ✅ Same as production deployment

**Steps:**

1. **Create MongoDB Atlas Account**
   ```bash
   # Visit: https://www.mongodb.com/cloud/atlas
   # Sign up for free
   # Create a new organization
   ```

2. **Create Free Cluster**
   - Click "Create" → Deploy a Database
   - Choose "FREE" tier
   - Region: Choose closest to you
   - Cluster name: `skyvault`
   - Create cluster (wait 2-3 minutes)

3. **Setup Connection**
   - Click "Connect"
   - Choose "Connect with MongoDB Shell"
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/skyvault`

4. **Update Environment**
   ```bash
   cd backend
   nano .env
   # Change MONGO_URI to your connection string:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skyvault
   ```

5. **Run Backend**
   ```bash
   npm run dev
   ```

**Connection String Example:**
```
mongodb+srv://john:password123@skyvault-abc123.mongodb.net/skyvault?retryWrites=true&w=majority
```

---

## 🐳 Option 2: Docker (LOCAL)

**Pros:**
- ✅ Local development
- ✅ Full control
- ✅ Easy to reset
- ✅ No cloud account needed

**Prerequisites:**
```bash
# Install Docker (if not installed)
# macOS/Linux: Download from https://www.docker.com/products/docker-desktop
# NixOS: nix-shell -p docker
```

**Steps:**

1. **Start MongoDB Container**
   ```bash
   docker run -d \
     -p 27017:27017 \
     --name skyvault-mongo \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password123 \
     mongo:latest
   ```

2. **Update .env**
   ```bash
   cd backend
   # Edit .env:
   MONGO_URI=mongodb://admin:password123@localhost:27017/skyvault?authSource=admin
   ```

3. **Test Connection**
   ```bash
   docker exec skyvault-mongo mongosh -u admin -p password123 --eval "db.version()"
   ```

4. **Run Backend**
   ```bash
   npm run dev
   ```

5. **Stop MongoDB (when done)**
   ```bash
   docker stop skyvault-mongo
   ```

6. **Restart MongoDB (next session)**
   ```bash
   docker start skyvault-mongo
   ```

7. **Cleanup (if needed)**
   ```bash
   docker stop skyvault-mongo
   docker rm skyvault-mongo
   ```

---

## 💻 Option 3: Nix Shell with MongoDB

**If MongoDB is available in a specific nixpkgs version:**

```bash
# Create temporary shell with MongoDB
nix-shell -p mongodb

# Then start:
mongod --dbpath ./data/db
```

---

## ✅ Quick Start Guide

### Using Atlas (Fastest)

```bash
# 1. Update backend/.env with Atlas URI
nano backend/.env

# 2. Install dependencies
cd backend
npm install

# 3. Start server
npm run dev

# 4. Open frontend
cd ../frontend
python -m http.server 8000

# 5. Visit http://localhost:8000
```

### Using Docker

```bash
# 1. Start MongoDB
docker run -d \
  -p 27017:27017 \
  --name skyvault-mongo \
  mongo:latest

# 2. Backend .env (use default)
cd backend
# MONGO_URI already set to localhost

# 3. Install and run
npm install
npm run dev

# 4. Start frontend (new terminal)
cd frontend
python -m http.server 8000

# 5. Visit http://localhost:8000
```

---

## 🔧 Troubleshooting

### "mongod: command not found"
**Solution:** Use Docker or Atlas instead. MongoDB CE not in NixOS nixpkgs.

### "Connection refused on localhost:27017"
**Solutions:**
- Docker: Run `docker run -d -p 27017:27017 mongo:latest`
- Atlas: Ensure MONGO_URI updated in .env
- Firewall: Check if port 27017 is blocked

### "Authentication failed"
**Atlas:** Double-check username and password in connection string
**Docker:** Verify credentials in container startup command

### "Cannot connect to cluster"
**Atlas:** 
- Check IP is whitelisted (Atlas Security → IP Whitelist)
- Add your IP or 0.0.0.0/0 (development only)

### "MongooseError: Cannot connect"
**Check:**
```bash
# Test connection manually
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/skyvault"
```

---

## 📊 Comparison

| Feature | Atlas | Docker | System |
|---------|-------|--------|--------|
| Setup Time | 5 min | 2 min | Varies |
| Local? | No | Yes | Yes |
| Free Tier | ✅ 512MB | ✅ Unlimited | N/A |
| NixOS Friendly | ✅ | ✅ | ❌ |
| Production Ready | ✅ | ❌ | ❌ |
| Recommended | ⭐⭐⭐ | ⭐⭐ | ❌ |

---

## 🚀 Full Setup Example (Atlas)

```bash
# Terminal 1: Start backend
cd /Users/balraj/SkyVault/backend
npm install
npm run dev
# Output: Server running on http://localhost:5000

# Terminal 2: Start frontend
cd /Users/balraj/SkyVault/frontend
python -m http.server 8000
# Output: Serving HTTP on http://localhost:8000

# Browser
# Visit http://localhost:8000
# Register → Login → Upload files → Done! ✅
```

---

## 📝 .env Configuration Examples

**For Atlas:**
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/skyvault
JWT_SECRET=your-secret-key-here
PORT=5000
MAX_FILE_SIZE=10485760
```

**For Docker:**
```env
MONGO_URI=mongodb://admin:password123@localhost:27017/skyvault?authSource=admin
JWT_SECRET=your-secret-key-here
PORT=5000
MAX_FILE_SIZE=10485760
```

---

## 🎓 Why These Options?

**Atlas is recommended because:**
1. No local installation hassles
2. Same setup as production
3. Free tier is generous
4. Works perfectly on NixOS
5. Future scalability built-in

**Docker is good for:**
1. Local-only development
2. Testing without cloud account
3. Isolated environments
4. Easy to reset

**System MongoDB:**
1. Not available on NixOS without extra setup
2. Not recommended for this project

---

## 💡 Next Steps

1. Choose Option 1 (Atlas) or Option 2 (Docker)
2. Setup MongoDB using your choice
3. Update `.env` with connection string
4. Run `cd backend && npm run dev`
5. Done! Start uploading files ✨

---

**Happy coding! ☁️**
