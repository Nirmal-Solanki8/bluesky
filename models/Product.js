const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
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
      'Pool Filtration & Pumps',
      'Underwater LED Lights',
      'Pool Chemicals & Water Care',
      'Cleaning Equipment & Robots',
      'Pool Heating & Heat Pumps',
      'Pool Tiles & Mosaics',
      'Ladders & Pool Fittings',
      'Fountain & Water Features'
    ]
  },
  price: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: 'Bluesky International'
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specifications: [{
    key: String,
    value: String
  }],
  image: {
    type: String,
    default: '/images/default-product.jpg'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Query indexes
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
