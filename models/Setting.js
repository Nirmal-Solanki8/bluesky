const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Bluesky International'
  },
  tagline: {
    type: String,
    default: 'Luxury Swimming Pool Architecture, Turnkey Construction & Filtration Engineering'
  },
  phone: {
    type: String,
    default: '+91 81289 20702'
  },
  whatsapp: {
    type: String,
    default: '+91 81289 20702'
  },
  email: {
    type: String,
    default: 'info@blueskyinternational.in'
  },
  address: {
    type: String,
    default: 'A-8, Laxmikant Ashram Rd, Rashi Circle, Bhulabhai Desai Park, Hari Darshan Society, Katargam, Surat, Gujarat 395004'
  },
  experienceYears: {
    type: Number,
    default: 16
  },
  poolsBuilt: {
    type: Number,
    default: 650
  },
  happyClients: {
    type: Number,
    default: 580
  },
  maintenanceContracts: {
    type: Number,
    default: 120
  },
  facebook: { type: String, default: '#' },
  instagram: { type: String, default: '#' },
  linkedin: { type: String, default: '#' },
  youtube: { type: String, default: '#' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
