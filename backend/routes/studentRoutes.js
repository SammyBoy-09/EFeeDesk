const express = require('express');
const router = express.Router();
const {
  getFeesDetails,
  makePayment,
  getPaymentHistory,
  getPaymentDetails
} = require('../controllers/studentController');
const { authMiddleware, isStudent } = require('../middleware/auth');

// All routes require authentication and student role
router.use(authMiddleware, isStudent);

// @route   GET /api/student/fees
// @desc    Get student's fee details
// @access  Private (Student)
router.get('/fees', getFeesDetails);

// @route   POST /api/student/pay
// @desc    Make a payment
// @access  Private (Student)
router.post('/pay', makePayment);

// @route   GET /api/student/payment-history
// @desc    Get payment history
// @access  Private (Student)
router.get('/payment-history', getPaymentHistory);

// @route   GET /api/student/payment/:id
// @desc    Get single payment details
// @access  Private (Student)
router.get('/payment/:id', getPaymentDetails);

module.exports = router;
