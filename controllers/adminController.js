const Admin = require('../models/Admin');
const Inquiry = require('../models/Inquiry');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const Testimonial = require('../models/Testimonial');
const { invalidateSettingsCache } = require('./publicController');

// Slug generator
const makeSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Date.now().toString().slice(-4);
};

// Auth: login page
exports.getLogin = (req, res) => {
  res.render('admin/login', {
    layout: false,
    title: 'Admin Login | Bluesky International'
  });
};

// Auth: login action
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      req.flash('error_msg', 'Invalid Email or Password');
      return res.redirect('/admin/login');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid Email or Password');
      return res.redirect('/admin/login');
    }

    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    req.flash('success_msg', `Welcome back, ${admin.name}!`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error during login.');
    res.redirect('/admin/login');
  }
};

// Auth: logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      totalServices,
      totalProjects,
      totalProducts,
      totalTestimonials,
      recentInquiries
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      Service.countDocuments(),
      Project.countDocuments(),
      Product.countDocuments(),
      Testimonial.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(6).lean()
    ]);

    res.render('admin/dashboard', {
      title: 'Dashboard Overview',
      totalInquiries,
      newInquiries,
      totalServices,
      totalProjects,
      totalProducts,
      totalTestimonials,
      recentInquiries,
      admin: req.session.admin,
      activeMenu: 'dashboard'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Inquiries: list
exports.getInquiries = async (req, res) => {
  try {
    const statusFilter = req.query.status;
    const query = statusFilter ? { status: statusFilter } : {};

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 }).lean();

    res.render('admin/inquiries', {
      title: 'Inquiries & Lead Management',
      inquiries,
      statusFilter: statusFilter || 'All',
      admin: req.session.admin,
      activeMenu: 'inquiries'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Inquiries: update status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    await Inquiry.findByIdAndUpdate(id, { status, adminNotes });
    req.flash('success_msg', 'Inquiry status updated successfully.');
    res.redirect('/admin/inquiries');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update inquiry.');
    res.redirect('/admin/inquiries');
  }
};

// Inquiries: delete
exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Inquiry deleted successfully.');
    res.redirect('/admin/inquiries');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete inquiry.');
    res.redirect('/admin/inquiries');
  }
};

// Services: list
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 }).lean();
    res.render('admin/services', {
      title: 'Manage Pool Services',
      services,
      admin: req.session.admin,
      activeMenu: 'services'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Services: add
exports.postAddService = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, features, order, imageUrl } = req.body;
    const image = req.file 
      ? `/uploads/${req.file.filename}` 
      : (imageUrl && imageUrl.trim() ? imageUrl.trim() : '/images/infinity-pool.jpg');
    const slug = makeSlug(title);
    const featureArray = features ? features.split(',').map(f => f.trim()).filter(Boolean) : [];

    await Service.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      features: featureArray,
      image,
      order: order ? Number(order) : 0
    });

    req.flash('success_msg', 'New swimming pool service added successfully.');
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to add service: ' + error.message);
    res.redirect('/admin/services');
  }
};

// Services: delete
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Service removed successfully.');
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete service.');
    res.redirect('/admin/services');
  }
};

// Services: edit page
exports.getEditService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) {
      req.flash('error_msg', 'Service not found.');
      return res.redirect('/admin/services');
    }
    res.render('admin/edit-service', {
      title: `Edit Service: ${service.title}`,
      service,
      admin: req.session.admin,
      activeMenu: 'services'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Services: update
exports.postEditService = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, features, order, imageUrl } = req.body;
    const updateData = {
      title,
      shortDescription,
      fullDescription,
      order: order !== undefined ? Number(order) : 0,
      features: features ? features.split(',').map(f => f.trim()).filter(Boolean) : []
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      updateData.image = imageUrl.trim();
    }

    await Service.findByIdAndUpdate(req.params.id, { $set: updateData });
    req.flash('success_msg', 'Service updated successfully.');
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update service.');
    res.redirect('/admin/services');
  }
};

// Project categories
const PROJECT_CATEGORIES = [
  'Residential Villa Pools',
  'Commercial & Hotel Pools',
  'Infinity Edge Pools',
  'Farmhouse & Estate Pools',
  'Rooftop Pools',
  'Jacuzzi & Spa Pools',
  'Fountains & Waterfalls'
];

// Projects: list
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    res.render('admin/projects', {
      title: 'Manage Pool Projects & Portfolio',
      projects,
      categories: PROJECT_CATEGORIES,
      admin: req.session.admin,
      activeMenu: 'projects'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Projects: add
exports.postAddProject = async (req, res) => {
  try {
    const { title, category, location, clientName, dimensions, completionYear, description, isFeatured, imageUrl } = req.body;
    const coverImage = req.file 
      ? `/uploads/${req.file.filename}` 
      : (imageUrl && imageUrl.trim() ? imageUrl.trim() : '/images/infinity-pool.jpg');
    const slug = makeSlug(title);

    await Project.create({
      title,
      slug,
      category,
      location,
      clientName,
      dimensions,
      completionYear: completionYear || '2024',
      description,
      coverImage,
      isFeatured: isFeatured === 'on' || isFeatured === 'true'
    });

    req.flash('success_msg', 'Project portfolio entry created successfully.');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to create project entry: ' + error.message);
    res.redirect('/admin/projects');
  }
};

// Projects: edit page
exports.getEditProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      req.flash('error_msg', 'Project not found.');
      return res.redirect('/admin/projects');
    }
    res.render('admin/edit-project', {
      title: `Edit Project: ${project.title}`,
      project,
      categories: PROJECT_CATEGORIES,
      admin: req.session.admin,
      activeMenu: 'projects'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Projects: update
exports.postEditProject = async (req, res) => {
  try {
    const { title, category, location, clientName, dimensions, completionYear, description, isFeatured, imageUrl } = req.body;
    const updateData = {
      title,
      category,
      location,
      clientName,
      dimensions,
      completionYear: completionYear || '2024',
      description,
      isFeatured: isFeatured === 'on' || isFeatured === 'true'
    };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      updateData.coverImage = imageUrl.trim();
    }

    await Project.findByIdAndUpdate(req.params.id, { $set: updateData });
    req.flash('success_msg', 'Project updated successfully.');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update project: ' + error.message);
    res.redirect('/admin/projects');
  }
};

// Projects: delete
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Project deleted successfully.');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete project.');
    res.redirect('/admin/projects');
  }
};

// Product categories
const PRODUCT_CATEGORIES = [
  'Pool Filtration & Pumps',
  'Underwater LED Lights',
  'Pool Chemicals & Water Care',
  'Cleaning Equipment & Robots',
  'Pool Heating & Heat Pumps',
  'Pool Tiles & Mosaics',
  'Ladders & Pool Fittings',
  'Fountain & Water Features'
];

// Products: list
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('admin/products', {
      title: 'Manage Pool Products & Equipment',
      products,
      categories: PRODUCT_CATEGORIES,
      admin: req.session.admin,
      activeMenu: 'products'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Products: add
exports.postAddProduct = async (req, res) => {
  try {
    const { name, category, price, brand, shortDescription, description, inStock, isFeatured, imageUrl } = req.body;
    const image = req.file 
      ? `/uploads/${req.file.filename}` 
      : (imageUrl && imageUrl.trim() ? imageUrl.trim() : '/images/resort-pool.jpg');
    const slug = makeSlug(name);

    await Product.create({
      name,
      slug,
      category,
      price: price ? Number(price) : 0,
      brand: brand || 'Bluesky International',
      shortDescription,
      description,
      image,
      inStock: inStock === 'on' || inStock === 'true',
      isFeatured: isFeatured === 'on' || isFeatured === 'true'
    });

    req.flash('success_msg', 'Product added successfully.');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to add product: ' + error.message);
    res.redirect('/admin/products');
  }
};

// Products: edit page
exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      req.flash('error_msg', 'Product not found.');
      return res.redirect('/admin/products');
    }
    res.render('admin/edit-product', {
      title: `Edit Product: ${product.name}`,
      product,
      categories: PRODUCT_CATEGORIES,
      admin: req.session.admin,
      activeMenu: 'products'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Products: update
exports.postEditProduct = async (req, res) => {
  try {
    const { name, category, price, brand, shortDescription, description, inStock, isFeatured, imageUrl } = req.body;
    const updateData = {
      name,
      category,
      price: price !== undefined ? Number(price) : 0,
      brand: brand || 'Bluesky International',
      shortDescription,
      description,
      inStock: inStock === 'on' || inStock === 'true',
      isFeatured: isFeatured === 'on' || isFeatured === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      updateData.image = imageUrl.trim();
    }

    await Product.findByIdAndUpdate(req.params.id, { $set: updateData });
    req.flash('success_msg', 'Product updated successfully.');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update product: ' + error.message);
    res.redirect('/admin/products');
  }
};

// Products: delete
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Product deleted successfully.');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete product.');
    res.redirect('/admin/products');
  }
};

// Testimonials: list
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    res.render('admin/testimonials', {
      title: 'Manage Client Reviews & Testimonials',
      testimonials,
      admin: req.session.admin,
      activeMenu: 'testimonials'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Testimonials: add
exports.postAddTestimonial = async (req, res) => {
  try {
    const { clientName, designation, location, rating, review, isApproved } = req.body;
    await Testimonial.create({
      clientName,
      designation: designation || 'Pool Owner',
      location: location || '',
      rating: rating ? Number(rating) : 5,
      review,
      isApproved: isApproved === 'on' || isApproved === 'true'
    });

    req.flash('success_msg', 'Testimonial added successfully.');
    res.redirect('/admin/testimonials');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to add testimonial.');
    res.redirect('/admin/testimonials');
  }
};

// Testimonials: edit page
exports.getEditTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id).lean();
    if (!testimonial) {
      req.flash('error_msg', 'Testimonial not found.');
      return res.redirect('/admin/testimonials');
    }
    res.render('admin/edit-testimonial', {
      title: `Edit Testimonial: ${testimonial.clientName}`,
      testimonial,
      admin: req.session.admin,
      activeMenu: 'testimonials'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Testimonials: update
exports.postEditTestimonial = async (req, res) => {
  try {
    const { clientName, designation, location, rating, review, isApproved } = req.body;
    const updateData = {
      clientName,
      designation: designation || 'Pool Owner',
      location: location || '',
      rating: rating ? Number(rating) : 5,
      review,
      isApproved: isApproved === 'on' || isApproved === 'true'
    };

    await Testimonial.findByIdAndUpdate(req.params.id, { $set: updateData });
    req.flash('success_msg', 'Testimonial updated successfully.');
    res.redirect('/admin/testimonials');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update testimonial.');
    res.redirect('/admin/testimonials');
  }
};

// Testimonials: delete
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Testimonial deleted successfully.');
    res.redirect('/admin/testimonials');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete testimonial.');
    res.redirect('/admin/testimonials');
  }
};

// Settings: get
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne().lean();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.render('admin/settings', {
      title: 'Website Settings & Company Info',
      settings,
      admin: req.session.admin,
      activeMenu: 'settings'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Settings: save
exports.postSettings = async (req, res) => {
  try {
    const {
      companyName,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      experienceYears,
      poolsBuilt,
      happyClients,
      maintenanceContracts,
      facebook,
      instagram,
      linkedin,
      youtube
    } = req.body;

    await Setting.findOneAndUpdate(
      {},
      {
        companyName,
        tagline,
        phone,
        whatsapp,
        email,
        address,
        experienceYears: Number(experienceYears) || 16,
        poolsBuilt: Number(poolsBuilt) || 650,
        happyClients: Number(happyClients) || 580,
        maintenanceContracts: Number(maintenanceContracts) || 120,
        facebook,
        instagram,
        linkedin,
        youtube
      },
      { upsert: true, new: true }
    );

    if (typeof invalidateSettingsCache === 'function') {
      invalidateSettingsCache();
    }

    req.flash('success_msg', 'Website settings updated successfully.');
    res.redirect('/admin/settings');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to update website settings.');
    res.redirect('/admin/settings');
  }
};

