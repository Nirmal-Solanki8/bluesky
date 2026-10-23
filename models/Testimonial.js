const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    default: 'Pool Owner'
  },
  location: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  review: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Query index
testimonialSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
