const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

const updateStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update existing students with USN and Semester
    const updates = [
      {
        email: 'john.doe@cambridge.edu.in',
        usn: '1CR21CS101',
        sem: 5
      },
      {
        email: 'jane.smith@cambridge.edu.in',
        usn: '1CR22EC045',
        sem: 3
      },
      {
        email: 'robert.wilson@cambridge.edu.in',
        usn: '1CR20ME023',
        sem: 7
      }
    ];

    for (const update of updates) {
      await User.findOneAndUpdate(
        { email: update.email },
        { $set: { usn: update.usn, sem: update.sem } }
      );
      console.log(`✅ Updated ${update.email}`);
    }

    console.log('\n✨ All students updated successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Update error:', error);
    process.exit(1);
  }
};

updateStudents();
