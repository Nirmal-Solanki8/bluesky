const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  poolType: {
    type: String,
    default: 'Residential Pool'
  },
  poolDimensions: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  budget: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'Quotation request via website'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Quotation Sent', 'Deal Closed', 'Cancelled'],
    default: 'New'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Query indexes
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
