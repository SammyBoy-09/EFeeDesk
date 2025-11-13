# EFeeDesk Setup Guide - Network Connection Issues

## Problem
Your Android phone cannot reach your backend API on your PC because they are on different networks.

### Current Network Status:
- **PC Main Network**: 130.1.55.136 (appears to be corporate/institutional)
- **PC Virtual Adapter**: 192.168.137.1 (hotspot adapter)
- **Phone Network**: Unknown (needs verification)

---

## Solution 1: Use PC Mobile Hotspot (RECOMMENDED ✅)

### Step 1: Enable Mobile Hotspot on PC
1. Open **Settings** on Windows
2. Go to **Network & Internet**
3. Click **Mobile hotspot** (or Hotspot if on Windows 11)
4. Toggle **Share my internet connection** to **ON**
5. Choose connection to share: **Wi-Fi** or **Ethernet**
6. Note the network name and password shown

### Step 2: Connect Phone to Hotspot
1. On your Android phone, go to **Settings > Wi-Fi**
2. Look for your PC's hotspot network name
3. Connect to it using the password shown on your PC
4. Wait for connection confirmation

### Step 3: Find Hotspot Gateway IP
On your PC, in the Mobile hotspot settings, the gateway IP is usually **192.168.137.1**

### Step 4: Update Frontend API Configuration
Edit `frontend/utils/api.js` and update:

```javascript
const API_URL = 'http://192.168.137.1:5000/api';
```

### Step 5: Reload App
1. In Expo terminal, press **`r`** to reload
2. Try logging in with:
   - Email: `admin@cambridge.edu.in`
   - Password: `admin123`

---

## Solution 2: Check Existing Network

### If you want both devices on same existing network:

1. **On Phone**: Open Settings > About Phone > scroll to find IP address
2. **Verify both are on same network**:
   - PC IP: 130.1.55.136
   - Phone IP: Should start with 130.1.x.x
   - If different, you're on different networks

3. **If different networks**: Use hotspot solution above

---

## Solution 3: Network Troubleshooting

### Test if PC can reach phone:
```powershell
# On PC PowerShell, get your phone's IP and ping it
ping <your-phone-ip>
```

### Test if phone can reach PC:
1. Open a browser on your phone
2. Try: `http://130.1.55.136:5000`
3. Should see: `{"success":true,"message":"EFeeDesk API is running"}`
4. If it loads, update API_URL to 130.1.55.136
5. If it doesn't load, networks are isolated - use hotspot

---

## Backend Status

✅ **Backend Running**:
- Address: `0.0.0.0:5000`
- Can be reached at:
  - `http://localhost:5000` (from PC)
  - `http://130.1.55.136:5000` (from same 130.1.x.x network)
  - `http://192.168.137.1:5000` (from hotspot connection)

✅ **Database**: MongoDB Atlas connected

✅ **API Health**: `/` endpoint returns `{"success":true,"message":"EFeeDesk API is running"}`

---

## Quick Checklist

- [ ] Phone and PC on same network (verified both IPs)
- [ ] PC hotspot enabled (if using hotspot solution)
- [ ] Backend running: `npm run dev` in `backend/` folder
- [ ] Expo running: `npx expo start` in `frontend/` folder
- [ ] API_URL updated in `frontend/utils/api.js`
- [ ] App reloaded in Expo (press `r`)
- [ ] Can ping PC from phone (or can access `http://api-ip:5000` in browser)
- [ ] Trying login with: `admin@cambridge.edu.in` / `admin123`

---

## If Still Having Issues

Please provide:
1. **Your phone's IP address** (Settings > About > IP address)
2. **Network name** your phone is connected to
3. **Error message** you get when trying to login
4. **Result of:** Can you open `http://192.168.137.1:5000` in your phone's browser?

