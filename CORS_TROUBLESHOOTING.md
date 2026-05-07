# CORS & "Failed to Fetch" Error - Troubleshooting Guide

If you see **"Error: Failed to fetch"** in the SkyVault frontend, this is usually a CORS (Cross-Origin Resource Sharing) issue.

---

## 🔍 What is CORS?

When your frontend and backend run on **different ports or domains**, browsers block requests for security reasons. You need CORS headers to allow this communication.

**Example:**
- Frontend: `http://localhost:8000` (running on port 8000)
- Backend: `http://localhost:5000` (running on port 5000)
- ❌ Browser blocks requests → "Failed to fetch"

---

## ✅ Quick Fix Checklist

### 1. **Backend IS Running**
```bash
# Check backend is on port 5000
curl http://localhost:5000/api/health
# Should return: {"status": "Server running ✅"}
```

If it fails:
```bash
cd backend
npm run dev
# Wait for: "🚀 Server running on http://localhost:5000"
```

### 2. **Frontend on Different Port (Correct!)**
```bash
# Frontend should be on port 8000, NOT 5000
cd frontend
python -m http.server 8000
# Visit: http://localhost:8000 (not :5000)
```

### 3. **Browser Console - Check Errors**
- Open browser DevTools: **F12** or **Cmd+Option+I**
- Go to **Console** tab
- Look for error messages mentioning CORS
- Check **Network** tab for failed requests

### 4. **Verify API URL**
The console should show:
```
📡 API URL: http://localhost:5000/api
```

---

## 🛠️ What Was Fixed

Updated backend CORS configuration to support multiple frontend ports:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:8000',      // Common dev port
    'http://localhost:3000',      // Another common port
    'http://127.0.0.1:8000',      // IPv4 localhost
    'http://127.0.0.1:3000',
    'http://localhost',
    'http://127.0.0.1',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
```

---

## 🚀 Test the Fix

**Terminal 1: Start Backend**
```bash
cd backend
npm run dev
# Wait for: "🚀 Server running on http://localhost:5000"
```

**Terminal 2: Start Frontend**
```bash
cd frontend
python -m http.server 8000
# Output: Serving HTTP on 0.0.0.0:8000
```

**Browser:**
1. Visit: `http://localhost:8000`
2. Open DevTools (F12)
3. Console should show: `📡 API URL: http://localhost:5000/api`
4. Register and login
5. Should work! ✅

---

## ❌ Common Issues & Solutions

### Issue: "Failed to fetch" when registering

**Cause:** Backend not running or API URL wrong

**Solution:**
```bash
# 1. Verify backend is running
curl http://localhost:5000/api/health

# 2. If not, start it
cd backend && npm run dev

# 3. Check browser console (F12) for actual error
# 4. Check Network tab for failed requests
```

---

### Issue: CORS error in DevTools

**Cause:** Server not allowing requests from frontend origin

**Solution:**
✅ Already fixed in server.js with extended corsOptions

Restart backend:
```bash
cd backend
npm run dev
```

---

### Issue: API_URL shows wrong port

**Frontend now auto-detects:**
```javascript
const getAPIUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};
```

This means:
- If frontend on `localhost:8000`, API will be `localhost:5000` ✅
- If frontend on `127.0.0.1:8000`, API will be `127.0.0.1:5000` ✅

---

### Issue: Getting "401 Unauthorized"

This means API is reachable but token is missing/invalid

**Solution:**
1. Make sure you registered first
2. Copy token from localStorage (DevTools → Application → localStorage)
3. Token should be sent in headers: `Authorization: Bearer <token>`

---

## 📊 Network Tab Analysis

If still getting errors, check **Network tab in DevTools:**

1. **Request shows error (red):**
   - Status like 404, 500, etc.
   - Backend might not be running

2. **Request blocks with CORS error:**
   - Browser blocked the request
   - Check backend CORS configuration

3. **Request succeeds but JavaScript error:**
   - API returned wrong data format
   - Check if backend is MongoDB connected

---

## 🐛 Debug Mode

Add this to browser console to see API requests:

```javascript
// Enable logging
const oldFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🔹 Fetch:', args[0], args[1]);
  return oldFetch(...args).then(r => {
    console.log('🔹 Response:', r.status, r.statusText);
    return r;
  }).catch(e => {
    console.error('🔹 Error:', e);
    throw e;
  });
};
```

---

## ✨ Updated Frontend Features

All frontend pages now have:
- ✅ Auto-detecting API URL (same host, port 5000)
- ✅ Detailed error messages
- ✅ Console logging for debugging
- ✅ Proper HTTP status checking
- ✅ Better error handling

---

## 🚨 Emergency Checklist

If nothing works:

```bash
# 1. Kill all node processes
pkill -f "node"

# 2. Restart backend fresh
cd backend
npm run dev

# 3. Check it's really running
curl http://localhost:5000/api/health
# Should return JSON

# 4. Start frontend on DIFFERENT port
cd frontend
python -m http.server 8000

# 5. Visit http://localhost:8000
# 6. Open F12, check Console
```

---

## 📖 Files Updated

- ✅ `backend/src/server.js` - Enhanced CORS config
- ✅ `frontend/dashboard.html` - Better error handling
- ✅ `frontend/login.html` - API URL detection + logging
- ✅ `frontend/register.html` - API URL detection + logging

---

## 🎯 If Still Not Working

**Check these in order:**

1. Backend running? `curl localhost:5000/api/health`
2. Frontend on port 8000? (not 5000)
3. DevTools Console show API URL? (should be localhost:5000)
4. Network tab shows request going to right URL?
5. Backend responding with data or error?

**Still stuck?**
```bash
# Check backend logs
cd backend
npm run dev
# Look for error messages

# Test API directly with curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass"}'
```

---

## 💡 Production Notes

For production deployment:
- Update CORS origins with actual domain
- Remove localhost origins
- Use environment variables for CORS config
- Enable HTTPS (https://)

Example:
```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
  ],
  credentials: true,
};
```

---

**Happy troubleshooting! 🚀**
