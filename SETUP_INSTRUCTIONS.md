# 🚀 Setup Instructions

## MongoDB Setup (Choose One Option)

### **Option 1: MongoDB Atlas (Recommended - Free & Easy)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy your connection string
6. Replace the `MONGODB_URI` in `backend/.env` with your connection string

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/college-fees-db?retryWrites=true&w=majority
```

### **Option 2: Local MongoDB**

1. Download MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/college-fees-db
   ```

### **Option 3: Skip Database (Testing Frontend Only)**

If you just want to test the frontend UI without database:
1. Skip backend setup
2. The app will show network errors but you can see the UI

---

## Running the Application

### Step 1: Configure MongoDB
Update `backend/.env` with your MongoDB connection string (see options above)

### Step 2: Seed Database (Create Admin & Students)
```powershell
cd backend
node seedDatabase.js
```

You should see:
```
✅ Admin user created: admin@cambridge.edu.in
✅ Student created: john.doe@cambridge.edu.in
```

### Step 3: Start Backend Server
```powershell
# Terminal 1
cd backend
npm run dev
```

Server should start on http://localhost:5000

### Step 4: Update Frontend API URL
Edit `frontend/utils/api.js` and set the correct API URL:

**For Android Emulator:**
```javascript
const API_URL = 'http://10.0.2.2:5000/api';
```

**For iOS Simulator:**
```javascript
const API_URL = 'http://localhost:5000/api';
```

**For Physical Device:**
```javascript
const API_URL = 'http://YOUR_PC_IP:5000/api';  // e.g., http://192.168.1.100:5000/api
```

To find your PC's IP:
```powershell
ipconfig
```
Look for "IPv4 Address"

### Step 5: Start Frontend
```powershell
# Terminal 2 (new terminal)
cd frontend
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Scan QR code with Expo Go app on your phone

---

## 🔑 Login Credentials

### Admin
- **Email:** admin@cambridge.edu.in
- **Password:** admin123

### Student
- **Email:** john.doe@cambridge.edu.in
- **Password:** student123

---

## 🐛 Troubleshooting

### "Network Request Failed"
- Check if backend is running on http://localhost:5000
- Verify API_URL in `frontend/utils/api.js`
- For physical device, use your PC's IP address

### "MongoDB connection error"
- Make sure MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings
- Verify network connectivity

### "Port 5000 already in use"
- Change PORT in `backend/.env` to a different port (e.g., 5001)
- Update API_URL in frontend accordingly

---

## ✅ Quick Test

1. Backend running? Visit http://localhost:5000 in browser
   - Should see: `{"success":true,"message":"College Fees Payment API is running"}`

2. Frontend running? Look for QR code or "Expo DevTools"

3. Can login? Try admin credentials in the app

---

**Need Help?** Check README.md for detailed documentation.
