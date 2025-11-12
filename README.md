# 🎓 College Fees Payment App

A full-stack React Native mobile application for Cambridge University students to pay their college fees online easily. Built with the MERN stack (MongoDB, Express.js, React Native, Node.js) and Expo EAS.

## 📋 Features

### Authentication
- **Two User Types**: Admin and Student
- **JWT-based Authentication**: Secure login sessions
- **Email Validation**: Students must use `@cambridge.edu.in` emails
- **Role-based Access Control**: Separate interfaces for admins and students

### Admin Panel
- **Student Management**: Create, view, edit, and delete student accounts
- **Dashboard Statistics**: View total students, fees collected, and pending amounts
- **Payment Tracking**: Monitor all student payments
- **Fee Management**: Update total fees and student information

### Student Interface
- **Fee Dashboard**: View total fees, amount paid, and pending balance
- **Payment Processing**: Make payments with mock/test integration
- **Payment History**: Track all previous transactions
- **Progress Tracking**: Visual progress bar for fee payments

## 🛠️ Tech Stack

**Frontend:**
- React Native (Expo SDK 51)
- React Navigation 6
- React Native Paper (UI Components)
- Axios (API requests)
- AsyncStorage (Local storage)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs (Password hashing)

## 📦 Project Structure

```
/college-fees-app
├── /backend
│   ├── server.js
│   ├── /models
│   │   ├── User.js
│   │   └── Payment.js
│   ├── /routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── studentRoutes.js
│   ├── /controllers
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── studentController.js
│   ├── /middleware
│   │   └── auth.js
│   ├── package.json
│   └── .env
├── /frontend
│   ├── App.js
│   ├── /screens
│   │   ├── LoginScreen.js
│   │   ├── AdminDashboardScreen.js
│   │   ├── AddStudentScreen.js
│   │   ├── ManageStudentsScreen.js
│   │   ├── StudentDetailsScreen.js
│   │   ├── StudentDashboardScreen.js
│   │   ├── MakePaymentScreen.js
│   │   └── PaymentHistoryScreen.js
│   ├── /contexts
│   │   └── AuthContext.js
│   ├── /utils
│   │   ├── api.js
│   │   └── helpers.js
│   ├── package.json
│   ├── app.json
│   └── eas.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/college-fees-db
   JWT_SECRET=your_super_secret_jwt_key_change_this
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Create an admin user** (using MongoDB Compass or mongosh):
   ```javascript
   db.users.insertOne({
     email: "admin@cambridge.edu.in",
     password: "$2a$10$...", // Use bcrypt to hash password
     role: "admin",
     name: "Admin User",
     createdAt: new Date()
   })
   ```
   
   Or use Node.js to create admin:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
   ```

7. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL in `utils/api.js`:**
   - For Android Emulator: `http://10.0.2.2:5000/api`
   - For iOS Simulator: `http://localhost:5000/api`
   - For Physical Device: `http://YOUR_LOCAL_IP:5000/api`

4. **Start Expo development server:**
   ```bash
   npm start
   ```

5. **Run on device/emulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

### Building with EAS

1. **Login to Expo:**
   ```bash
   eas login
   ```

2. **Configure the project:**
   ```bash
   eas build:configure
   ```

3. **Build for Android (APK):**
   ```bash
   eas build --platform android --profile preview
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios --profile preview
   ```

5. **Build for production:**
   ```bash
   eas build --platform all --profile production
   ```

## 🔑 Default Credentials

### Admin Login
- **Email**: `admin@cambridge.edu.in`
- **Password**: `admin123` (change after first login)

### Student Login
Students are created by admins. Sample student:
- **Email**: `john.doe@cambridge.edu.in`
- **Password**: Set by admin during creation

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (admin/student)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Admin Routes (Requires Admin Role)
- `POST /api/admin/add-student` - Create student account
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student details
- `PATCH /api/admin/update-fees/:id` - Update student fees
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/dashboard-stats` - Get statistics

### Student Routes (Requires Student Role)
- `GET /api/student/fees` - Get fee details
- `POST /api/student/pay` - Make payment
- `GET /api/student/payment-history` - Get payment history
- `GET /api/student/payment/:id` - Get payment details

## 🎨 Screenshots

### Login Screen
- Email and password authentication
- Cambridge email validation for students

### Admin Dashboard
- Statistics overview
- Quick access to student management
- Add new students

### Student Dashboard
- Fee summary with progress bar
- Payment status
- Quick payment access

### Payment Screen
- Enter custom amount or use quick percentages
- Multiple payment methods (mock/test mode)
- Payment confirmation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Email validation for student accounts
- Secure HTTP-only headers
- Input validation and sanitization

## 🌟 Future Enhancements

- [ ] Real payment gateway integration (Razorpay/Stripe)
- [ ] Push notifications for payment reminders
- [ ] Email notifications for payment receipts
- [ ] PDF receipt generation
- [ ] Multi-semester fee management
- [ ] Installment payment plans
- [ ] Admin analytics dashboard
- [ ] Export payment reports
- [ ] Biometric authentication
- [ ] Dark mode support

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Port Already in Use:**
```bash
# Change PORT in .env file or kill the process
lsof -ti:5000 | xargs kill
```

### Frontend Issues

**Metro Bundler Cache:**
```bash
expo start -c
```

**Module Not Found:**
```bash
rm -rf node_modules
npm install
```

**Network Request Failed:**
- Check API_URL in `utils/api.js`
- Ensure backend is running
- Verify firewall settings

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Developed with ❤️ for Cambridge University

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@cambridge.edu.in or raise an issue in the repository.

---

**Note**: This is a demo application with mock payment integration. For production use, integrate real payment gateways and implement additional security measures.
