const express = require('express');
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudentFees,
  deleteStudent,
  getDashboardStats
} = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authMiddleware, isAdmin);

// @route   POST /api/admin/add-student
// @desc    Create a new student account
// @access  Private (Admin)
router.post('/add-student', addStudent);

// @route   GET /api/admin/students
// @desc    Get all students with payment info
// @access  Private (Admin)
router.get('/students', getAllStudents);

// @route   GET /api/admin/students/:id
// @desc    Get single student details
// @access  Private (Admin)
router.get('/students/:id', getStudent);

// @route   PATCH /api/admin/update-fees/:id
// @desc    Update student fees and information
// @access  Private (Admin)
router.patch('/update-fees/:id', updateStudentFees);

// @route   DELETE /api/admin/students/:id
// @desc    Delete student account
// @access  Private (Admin)
router.delete('/students/:id', deleteStudent);

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
