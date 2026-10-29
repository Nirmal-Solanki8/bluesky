require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Setting = require('../models/Setting');

// Database seeder
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crystal_pools');
    console.log('Connected to MongoDB for Seeding...');

    // Admin
    let admin = await Admin.findOne({ email: 'pritesh029@gmail.com' });
    if (!admin) {
      admin = new Admin({
        name: 'Pritesh (Bluesky Admin)',
        email: 'pritesh029@gmail.com',
        password: '123456',
        role: 'superadmin'
      });
      await admin.save();
      console.log('✅ Admin created: pritesh029@gmail.com / 123456');
    } else {
      admin.name = 'Pritesh (Bluesky Admin)';
      admin.password = '123456';
      await admin.save();
      console.log('✅ Admin updated: pritesh029@gmail.com / 123456');
    }

    // Settings
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
    }
    settings.companyName = 'Bluesky International';
    settings.tagline = 'Luxury Swimming Pool Architecture, Turnkey Construction & Filtration Engineering';
    settings.phone = '+91 81289 20702';
    settings.whatsapp = '+91 81289 20702';
    settings.email = 'pritesh029@gmail.com';
    settings.address = 'A-8, Laxmikant Ashram Rd, Rashi Circle, Bhulabhai Desai Park, Hari Darshan Society, Katargam, Surat, Gujarat 395004';
    settings.foundingYear = 2008;
    settings.experienceYears = Math.max(16, new Date().getFullYear() - 2008);
    settings.poolsBuilt = 720;
    settings.happyClients = 680;
    settings.maintenanceContracts = 150;
    await settings.save();
    console.log('✅ Company Settings updated to Bluesky International (+91 81289 20702).');

    // Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.create([
        {
          title: 'Architectural Infinity Edge Pools',
          slug: 'architectural-infinity-edge-pools',
          shortDescription: 'Signature vanishing-edge horizons with glass viewing walls and negative edge hydraulics.',
          fullDescription: 'Bluesky International crafts breathtaking infinity pools that visually merge with natural horizons and skies. Engineered with earthquake-resistant monolithic RCC, structural acrylic glass panels, and precision balancing tanks.',
          image: '/images/infinity-pool.jpg',
          features: ['Monolithic Leakproof RCC Structure', 'Submerged Architectural Acrylic Glass Walls', 'Zero-Noise Balancing Tank & Surge Systems', 'Smart Multi-Zone RGBW Lighting'],
          order: 1
        },
        {
          title: 'Luxury Villa & Rooftop Swimming Pools',
          slug: 'luxury-villa-rooftop-swimming-pools',
          shortDescription: 'Ultra-lightweight structural rooftop pools with advanced membrane waterproofing and sky views.',
          fullDescription: 'Engineered specifically for penthouses and luxury villa terraces. Featuring ultra-durable waterproofing membranes, high-rate compact filtration systems, and bespoke designer mosaics.',
          image: '/images/rooftop-pool.jpg',
          features: ['Engineered Structural Load Distribution', 'Triple-Layer Anti-Seepage Membrane', 'Quiet Eco Inverter Pumps', 'Anti-Slip Italian Deck Porcelain'],
          order: 2
        },
        {
          title: 'Commercial Resorts & Semi-Olympic Pools',
          slug: 'commercial-resorts-semi-olympic-pools',
          shortDescription: 'High-capacity pools built in compliance with FINA and international water safety standards.',
          fullDescription: 'Customized for 5-star hospitality resorts, sports clubs, and township clubhouses. Incorporates high-capacity bobbin wound sand filters, automatic ORP/pH controllers, and ozone sanitation.',
          image: '/images/resort-pool.jpg',
          features: ['FINA Standard Dimensions & Lane Lines', 'Automatic Chlorine & pH Dosing Units', 'Dual In-Ground Skimmers & Overflow Gratings', 'Underwater Sound & Lighting Systems'],
          order: 3
        },
        {
          title: 'Hydrotherapy Jacuzzi & Thermal Spas',
          slug: 'hydrotherapy-jacuzzi-thermal-spas',
          shortDescription: 'Heated hydrotherapy spas with targeted air-water massage jets and chromotherapy.',
          fullDescription: 'Turn your backyard or terrace into an opulent private wellness sanctuary with digital heat pumps, whisper-quiet air blowers, and ergonomic loungers.',
          image: '/images/jacuzzi-spa.jpg',
          features: ['Rotary Hydrotherapy Jets', 'Energy-Efficient Titanium Heat Pump', 'Ergonomic Therapeutic Seating', 'Touch Control & Smartphone App Sync'],
          order: 4
        },
        {
          title: 'Turnkey Pool Renovation & Leak Proofing',
          slug: 'turnkey-pool-renovation-leak-proofing',
          shortDescription: 'Modernization of aging pools, epoxy regrouting, LED retrofitting, and automated chlorination.',
          fullDescription: 'Revitalize cracked or leaking older pools into modern luxury oases with premium glass mosaic retiling, skimmer replacements, and automated filtration upgrades.',
          image: '/images/pool-types/vanishing-edge.webp',
          features: ['Structural Crack Injection & Sealing', 'Designer Glass Mosaic Retiling', 'Saltwater Chlorinator Conversion', 'Eco-Friendly Inverter Filtration Retrofit'],
          order: 5
        },
        {
          title: 'Annual Maintenance Contracts (AMC) & Water Care',
          slug: 'annual-maintenance-contracts-amc',
          shortDescription: 'Routine vacuum sweeping, chemical balancing, backwashing, and 24/7 technical assistance.',
          fullDescription: 'Keep your pool pristine and crystalline year-round with our certified pool chemists and technicians.',
          image: '/images/pool-types/overflow.webp',
          features: ['Bi-Weekly Suction Sweeping & Brushing', 'Precise pH & Free Chlorine Balancing', 'Preventative Pump & Multiport Servicing', '24/7 Rapid Emergency Response'],
          order: 6
        }
      ]);
      console.log('✅ Premium Services created.');
    }

    // Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: 'The Azure Horizon Infinity Pool',
          slug: 'azure-horizon-infinity-pool',
          category: 'Infinity Edge Pools',
          location: 'Sanand Palm Greens, Ahmedabad',
          dimensions: '45ft x 20ft x 4.5ft',
          completionYear: '2024',
          coverImage: '/images/infinity-pool.jpg',
          isFeatured: true
        },
        {
          title: 'Oasis Grand Resort Pool & Sunken Lounge',
          slug: 'oasis-grand-resort-pool',
          category: 'Commercial & Hotel Pools',
          location: 'Gir Forest Eco Resort, Gujarat',
          dimensions: '75ft x 35ft',
          completionYear: '2024',
          coverImage: '/images/resort-pool.jpg',
          isFeatured: true
        },
        {
          title: 'Royal Crest Villa Cantilevered Glass Pool',
          slug: 'royal-crest-villa-cantilevered-pool',
          category: 'Residential Villa Pools',
          location: 'Dumas Road, Surat',
          dimensions: '38ft x 16ft',
          completionYear: '2024',
          coverImage: '/images/rooftop-pool.jpg',
          isFeatured: true
        },
        {
          title: 'Skyline Terrace Heated Spa & Pool',
          slug: 'skyline-terrace-heated-spa-pool',
          category: 'Rooftop Pools',
          location: 'Bodakdev, Ahmedabad',
          dimensions: '28ft x 14ft',
          completionYear: '2023',
          coverImage: '/images/jacuzzi-spa.jpg',
          isFeatured: true
        }
      ]);
      console.log('✅ Premium Projects created.');
    }

    console.log('\n🎉 Bluesky International Seeding Completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();

