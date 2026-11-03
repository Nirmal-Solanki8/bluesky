const Service = require('../models/Service');
const Product = require('../models/Product');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Inquiry = require('../models/Inquiry');
const Setting = require('../models/Setting');

// Settings in-memory cache (60s TTL)
let cachedSettings = null;
let lastSettingsFetch = 0;
const SETTINGS_CACHE_TTL = 60 * 1000;

// Fetch company settings
const getCompanySettings = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedSettings && (now - lastSettingsFetch < SETTINGS_CACHE_TTL)) {
    return cachedSettings;
  }
  let settings = await Setting.findOne().lean();
  if (!settings) {
    const created = await Setting.create({});
    settings = created.toObject ? created.toObject() : created;
  }

  // Automatic calculation of Years of Mastery based on founding year (2008)
  const currentYear = new Date().getFullYear();
  const foundingYear = settings.foundingYear || 2008;
  const autoCalculatedYears = Math.max(16, currentYear - foundingYear);

  // Keep experienceYears always up to date automatically
  settings.experienceYears = settings.experienceYears
    ? Math.max(Number(settings.experienceYears), autoCalculatedYears)
    : autoCalculatedYears;

  cachedSettings = settings;
  lastSettingsFetch = now;
  return cachedSettings;
};

// Reset settings cache
exports.invalidateSettingsCache = () => {
  cachedSettings = null;
  lastSettingsFetch = 0;
};

// Home page
exports.getHome = async (req, res) => {
  try {
    const [settings, services, projects, products, testimonials] = await Promise.all([
      getCompanySettings(),
      Service.find({ isActive: true }).select('title slug shortDescription image features order').sort({ order: 1 }).limit(6).lean(),
      Project.find({ isFeatured: true }).select('title slug category location coverImage').limit(6).lean(),
      Product.find({ isFeatured: true }).select('name slug category price image inStock').limit(4).lean(),
      Testimonial.find({ isApproved: true }).select('clientName designation location rating review avatar').limit(4).lean()
    ]);

    res.render('public/home', {
      title: `${settings.companyName} | Swimming Pool Construction, Filtration & Maintenance`,
      settings,
      services,
      projects,
      products,
      testimonials,
      path: '/'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// About page
exports.getAbout = async (req, res) => {
  try {
    const [settings, testimonials, projects] = await Promise.all([
      getCompanySettings(),
      Testimonial.find({ isApproved: true }).select('clientName designation location rating review avatar').lean(),
      Project.find({ isFeatured: true }).select('title slug coverImage location category').limit(3).lean()
    ]);

    res.render('public/about', {
      title: `About Us | ${settings.companyName} | Luxury Swimming Pool Engineers`,
      settings,
      testimonials,
      projects,
      path: '/about'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Services page
exports.getServices = async (req, res) => {
  try {
    const [settings, services] = await Promise.all([
      getCompanySettings(),
      Service.find({ isActive: true }).select('title slug shortDescription fullDescription image features order').sort({ order: 1 }).lean()
    ]);

    res.render('public/services', {
      title: `Our Services | Swimming Pool Construction & Renovation`,
      settings,
      services,
      path: '/services'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Products page
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;

    const categories = [
      'Pool Filtration & Pumps',
      'Underwater LED Lights',
      'Pool Chemicals & Water Care',
      'Cleaning Equipment & Robots',
      'Pool Heating & Heat Pumps',
      'Pool Tiles & Mosaics',
      'Ladders & Pool Fittings',
      'Fountain & Water Features'
    ];

    const [settings, products] = await Promise.all([
      getCompanySettings(),
      Product.find(filter).select('name slug category price brand shortDescription image inStock isFeatured').sort({ createdAt: -1 }).lean()
    ]);

    res.render('public/products', {
      title: `Pool Equipment & Products | Pumps, Filters, Lights`,
      settings,
      products,
      categories,
      selectedCategory: category || 'all',
      path: '/products'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Gallery page
exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;

    const categories = [
      'Residential Villa Pools',
      'Commercial & Hotel Pools',
      'Infinity Edge Pools',
      'Farmhouse & Estate Pools',
      'Rooftop Pools',
      'Jacuzzi & Spa Pools',
      'Fountains & Waterfalls'
    ];

    const [settings, projects] = await Promise.all([
      getCompanySettings(),
      Project.find(filter).select('title slug category location coverImage dimensions completionYear').sort({ createdAt: -1 }).lean()
    ]);

    res.render('public/gallery', {
      title: `Project Gallery | Swimming Pools Portfolio`,
      settings,
      projects,
      categories,
      selectedCategory: category || 'all',
      path: '/gallery'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Contact page
exports.getContact = async (req, res) => {
  try {
    const settings = await getCompanySettings();
    res.render('public/contact', {
      title: `Contact Us | Get a Free Swimming Pool Quote`,
      settings,
      path: '/contact'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// 3D Survey page
exports.get3dSurvey = async (req, res) => {
  try {
    const settings = await getCompanySettings();
    res.render('public/3d-survey', {
      title: `Free 3D Laser Site Survey & Architectural Blueprint | Blue Sky International`,
      settings,
      path: '/3d-survey'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Inquiry submission (Saves to Admin Panel & Connects to WhatsApp)
exports.submitInquiry = async (req, res) => {
  try {
    const { name, phone, email, poolType, poolDimensions, city, budget, message } = req.body;

    if (!name || !name.trim()) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Please enter your Name.' });
      }
      req.flash('error_msg', 'Please enter your Name.');
      return res.redirect((req.headers.referer || '/contact') + '#quote-form');
    }

    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 7) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Please enter a valid Phone / Mobile Number.' });
      }
      req.flash('error_msg', 'Please enter a valid Phone / Mobile Number.');
      return res.redirect((req.headers.referer || '/contact') + '#quote-form');
    }

    const finalMessage = (message && message.trim())
      ? message.trim()
      : `Consultation requested for ${poolType || 'Swimming Pool'}. Dimensions: ${poolDimensions || 'Not specified'}, City: ${city || 'Not specified'}, Budget: ${budget || 'Not specified'}.`;

    // 1. Save to Database (Inquiry Model for Admin Panel)
    await Inquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (email && email.trim()) ? email.trim() : '',
      poolType: poolType || 'Residential Pool',
      poolDimensions: (poolDimensions && poolDimensions.trim()) ? poolDimensions.trim() : '',
      city: (city && city.trim()) ? city.trim() : '',
      budget: (budget && budget.trim()) ? budget.trim() : '',
      message: finalMessage,
      status: 'New'
    });

    // 2. Build Direct WhatsApp Concierge URL (Uses Dynamic Settings from Admin Panel)
    const companySettings = await getCompanySettings();
    const waPhone = (companySettings && companySettings.whatsapp)
      ? companySettings.whatsapp.replace(/\D/g, '')
      : '918128920702';
    const waLines = [
      `*New Architectural Consultation Request*`,
      `----------------------------------`,
      `👤 *Name:* ${name.trim()}`,
      `📱 *Phone / WhatsApp:* ${phone.trim()}`,
      (email && email.trim()) ? `✉️ *Email:* ${email.trim()}` : null,
      (city && city.trim()) ? `📍 *Location / City:* ${city.trim()}` : null,
      poolType ? `🏊 *Pool Classification:* ${poolType}` : null,
      (poolDimensions && poolDimensions.trim()) ? `📐 *Dimensions / Plot:* ${poolDimensions.trim()}` : null,
      (budget && budget.trim()) ? `💰 *Estimated Investment:* ${budget.trim()}` : null,
      (message && message.trim()) ? `📝 *Requirements:* ${message.trim()}` : null,
      `----------------------------------`,
      `Sent via Blue Sky International Portal`
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waLines)}`;

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({
        success: true,
        message: `Thank you, ${name.trim()}! Your consultation inquiry has been recorded.`,
        whatsappUrl: whatsappUrl
      });
    }

    req.flash('success_msg', `Thank you, ${name.trim()}! Your consultation request has been received.`);
    return res.redirect(whatsappUrl);
  } catch (error) {
    console.error('Submit Inquiry Error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'There was an issue submitting your inquiry. Please try again.' });
    }
    req.flash('error_msg', 'There was an issue submitting your inquiry. Please try again or reach out to us via our contact form.');
    res.redirect((req.headers.referer || '/contact') + '#quote-form');
  }
};

// Private pools page
exports.getPrivatePools = async (req, res) => {
  try {
    const [settings, projects] = await Promise.all([
      getCompanySettings(),
      Project.find({
        category: { $in: ['Residential Villa Pools', 'Infinity Edge Pools'] }
      }).select('title slug category location coverImage dimensions').limit(6).lean()
    ]);

    res.render('public/private-pools', {
      title: `Private Swimming Pools | Luxury Villa & Residential Pools | ${settings.companyName}`,
      settings,
      projects,
      path: '/private-swimming-pools'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Pool types page
exports.getPoolTypes = async (req, res) => {
  try {
    const [settings, projects] = await Promise.all([
      getCompanySettings(),
      Project.find().select('title slug category location coverImage').limit(8).lean()
    ]);

    res.render('public/pool-types', {
      title: `Swimming Pool Types & Designs | ${settings.companyName}`,
      settings,
      projects,
      path: '/pool-types'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

