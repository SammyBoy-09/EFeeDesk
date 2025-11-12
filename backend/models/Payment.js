const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'cash', 'bank_transfer', 'mock'],
    default: 'mock'
  },
  transactionId: {
    type: String,
    default: function() {
      return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: 'College fees payment'
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ studentId: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
