# 🚀 Quick Start Guide

## Installation

### 1. Install All Dependencies
From the root directory:
```powershell
npm run install-all
```

Or manually:
```powershell
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the Application

### Option 1: Using Root Scripts
```powershell
# Start backend server
npm run backend

# In a new terminal, start frontend
npm run frontend
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

## Database Setup

### 1. Start MongoDB
```powershell
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod
```

### 2. Seed the Database
```powershell
npm run seed
```

This creates:
- **Admin**: admin@cambridge.edu.in / admin123
- **Students**: john.doe@cambridge.edu.in / student123

## Important Configuration

### Backend API URL (frontend/utils/api.js)
Update based on your environment:

```javascript
// For Android Emulator
const API_URL = 'http://10.0.2.2:5000/api';

// For iOS Simulator  
const API_URL = 'http://localhost:5000/api';

// For Physical Device (replace with your PC's IP)
const API_URL = 'http://192.168.1.100:5000/api';
```

To find your IP:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Running on Device

### Android
```powershell
cd frontend
npm start
# Press 'a' for Android emulator
# Or scan QR code with Expo Go app
```

### iOS
```powershell
cd frontend
npm start
# Press 'i' for iOS simulator
```

## Building with EAS

### 1. Install EAS CLI
```powershell
npm install -g eas-cli
```

### 2. Login to Expo
```powershell
eas login
```

### 3. Configure Project
```powershell
cd frontend
eas build:configure
```

### 4. Build APK (Android)
```powershell
eas build --platform android --profile preview
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Check if port 5000 is available

### Frontend network errors
- Update API_URL in `frontend/utils/api.js`
- Ensure backend is running
- Check firewall settings

### Can't connect from physical device
- Backend and device must be on same WiFi
- Use your computer's local IP address
- Disable firewall temporarily for testing

## Default Login Credentials

### Admin
- Email: admin@cambridge.edu.in
- Password: admin123

### Student
- Email: john.doe@cambridge.edu.in
- Password: student123

## Next Steps

1. ✅ Install dependencies
2. ✅ Start MongoDB
3. ✅ Seed database
4. ✅ Start backend server
5. ✅ Update API URL in frontend
6. ✅ Start frontend
7. ✅ Login and test!

For detailed documentation, see README.md
