const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get student's fee details
// @route   GET /api/student/fees
// @access  Private (Student only)
exports.getFeesDetails = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student information
    const student = await User.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all successful payments
    const payments = await Payment.find({ 
      studentId,
      status: 'success'
    }).sort({ paymentDate: -1 });

    // Calculate total paid and pending
    const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const amountDue = student.totalFees - amountPaid;

    res.status(200).json({
      success: true,
      feesDetails: {
        totalFees: student.totalFees,
        amountPaid,
        amountDue,
        paymentHistory: payments
      }
    });
  } catch (error) {
    console.error('Get fees details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fees details',
      error: error.message
    });
  }
};

// @desc    Make a payment
// @route   POST /api/student/pay
// @access  Private (Student only)
exports.makePayment = async (req, res) => {
  try {
    const { amount, paymentMethod = 'mock' } = req.body;
    const studentId = req.user._id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    // Get student information
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Calculate current dues
    const payments = await Payment.find({ 
      studentId,
      status: 'success'
    });
    const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const amountDue = student.totalFees - amountPaid;

    // Check if payment amount exceeds due amount
    if (amount > amountDue) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed pending amount of ₹${amountDue}`
      });
    }

    // Create payment record
    const payment = await Payment.create({
      studentId,
      amount,
      paymentMethod,
      status: 'success',
      description: `College fees payment - ${student.name}`
    });

    // Calculate new balance
    const newAmountPaid = amountPaid + amount;
    const newAmountDue = student.totalFees - newAmountPaid;

    res.status(201).json({
      success: true,
      message: 'Payment successful',
      payment,
      updatedBalance: {
        totalFees: student.totalFees,
        amountPaid: newAmountPaid,
        amountDue: newAmountDue
      }
    });
  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment',
      error: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/student/payment-history
// @access  Private (Student only)
exports.getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const payments = await Payment.find({ studentId })
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history',
      error: error.message
    });
  }
};

// @desc    Get single payment details
// @route   GET /api/student/payment/:id
// @access  Private (Student only)
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      studentId: req.user._id
    }).populate('studentId', 'name email department year');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment details',
      error: error.message
    });
  }
};
