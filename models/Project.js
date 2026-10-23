const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Residential Villa Pools',
      'Commercial & Hotel Pools',
      'Infinity Edge Pools',
      'Farmhouse & Estate Pools',
      'Rooftop Pools',
      'Jacuzzi & Spa Pools',
      'Fountains & Waterfalls'
    ]
  },
  clientName: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    required: true
  },
  galleryImages: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  completionYear: {
    type: String,
    default: '2024'
  }
}, { timestamps: true });

// Query indexes
projectSchema.index({ category: 1, createdAt: -1 });
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
