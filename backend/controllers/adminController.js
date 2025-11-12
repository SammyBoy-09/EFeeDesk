const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Create a new student account
// @route   POST /api/admin/add-student
// @access  Private (Admin only)
exports.addStudent = async (req, res) => {
  try {
    const { email, password, name, department, year, totalFees } = req.body;

    // Validate input
    if (!email || !password || !name || !department || !year || totalFees === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if student email ends with @cambridge.edu.in
    if (!email.endsWith('@cambridge.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Student email must end with @cambridge.edu.in'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new student
    const student = await User.create({
      email,
      password,
      name,
      department,
      year,
      totalFees,
      role: 'student'
    });

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      student: {
        id: student._id,
        email: student.email,
        name: student.name,
        department: student.department,
        year: student.year,
        totalFees: student.totalFees
      }
    });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating student',
      error: error.message
    });
  }
};

// @desc    Get all students with payment information
// @route   GET /api/admin/students
// @access  Private (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get payment information for each student
    const studentsWithPayments = await Promise.all(
      students.map(async (student) => {
        const payments = await Payment.find({ 
          studentId: student._id,
          status: 'success'
        });

        const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const amountDue = student.totalFees - amountPaid;

        return {
          ...student.toObject(),
          amountPaid,
          amountDue,
          paymentHistory: payments
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentsWithPayments.length,
      students: studentsWithPayments
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message
    });
  }
};

// @desc    Get single student details
// @route   GET /api/admin/students/:id
// @access  Private (Admin only)
exports.getStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get payment information
    const payments = await Payment.find({ 
      studentId: student._id,
      status: 'success'
    }).sort({ paymentDate: -1 });

    const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const amountDue = student.totalFees - amountPaid;

    res.status(200).json({
      success: true,
      student: {
        ...student.toObject(),
        amountPaid,
        amountDue,
        paymentHistory: payments
      }
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student',
      error: error.message
    });
  }
};

// @desc    Update student fees and information
// @route   PATCH /api/admin/update-fees/:id
// @access  Private (Admin only)
exports.updateStudentFees = async (req, res) => {
  try {
    const { totalFees, name, department, year } = req.body;

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update fields if provided
    if (totalFees !== undefined) student.totalFees = totalFees;
    if (name) student.name = name;
    if (department) student.department = department;
    if (year) student.year = year;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student information updated successfully',
      student
    });
  } catch (error) {
    console.error('Update fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating student',
      error: error.message
    });
  }
};

// @desc    Delete student account
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete all payments associated with student
    await Payment.deleteMany({ studentId: student._id });

    // Delete student
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student account deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalPayments = await Payment.countDocuments({ status: 'success' });
    
    const students = await User.find({ role: 'student' });
    const totalFeesExpected = students.reduce((sum, student) => sum + student.totalFees, 0);
    
    const payments = await Payment.find({ status: 'success' });
    const totalFeesCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalFeesPending = totalFeesExpected - totalFeesCollected;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalPayments,
        totalFeesExpected,
        totalFeesCollected,
        totalFeesPending
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message
    });
  }
};
