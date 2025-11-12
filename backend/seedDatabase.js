const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

// Sample admin and student data
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - remove in production)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@cambridge.edu.in' });
    
    if (!existingAdmin) {
      // Create admin user
      const adminUser = await User.create({
        email: 'admin@cambridge.edu.in',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
      });
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample students
    const students = [
      {
        email: 'john.doe@cambridge.edu.in',
        password: 'student123',
        role: 'student',
        name: 'John Doe',
        usn: '1CR21CS101',
        department: 'Computer Science',
        year: 3,
        sem: 5,
        totalFees: 150000,
      },
      {
        email: 'jane.smith@cambridge.edu.in',
        password: 'student123',
        role: 'student',
        name: 'Jane Smith',
        usn: '1CR22EC045',
        department: 'Electronics',
        year: 2,
        sem: 3,
        totalFees: 140000,
      },
      {
        email: 'robert.wilson@cambridge.edu.in',
        password: 'student123',
        role: 'student',
        name: 'Robert Wilson',
        usn: '1CR20ME023',
        department: 'Mechanical',
        year: 4,
        sem: 7,
        totalFees: 160000,
      },
    ];

    for (const studentData of students) {
      const existingStudent = await User.findOne({ email: studentData.email });
      if (!existingStudent) {
        const student = await User.create(studentData);
        console.log('✅ Student created:', student.email);
      } else {
        console.log('ℹ️  Student already exists:', studentData.email);
      }
    }

    console.log('\n✨ Database seeding completed!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@cambridge.edu.in / admin123');
    console.log('Student: john.doe@cambridge.edu.in / student123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
