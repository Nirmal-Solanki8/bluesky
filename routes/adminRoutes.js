const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isGuest } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Auth
router.get('/login', isGuest, adminController.getLogin);
router.post('/login', isGuest, adminController.postLogin);
router.get('/logout', isAuthenticated, adminController.logout);

// Dashboard
router.get('/', isAuthenticated, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Inquiries
router.get('/inquiries', isAuthenticated, adminController.getInquiries);
router.post('/inquiries/:id/status', isAuthenticated, adminController.updateInquiryStatus);
router.post('/inquiries/:id/delete', isAuthenticated, adminController.deleteInquiry);

// Products
router.get('/products', isAuthenticated, adminController.getProducts);
router.get('/product', isAuthenticated, (req, res) => res.redirect('/admin/products'));
router.post('/products', isAuthenticated, upload.single('image'), adminController.postAddProduct);
router.get('/products/:id/edit', isAuthenticated, adminController.getEditProduct);
router.post('/products/:id/edit', isAuthenticated, upload.single('image'), adminController.postEditProduct);
router.post('/products/:id/delete', isAuthenticated, adminController.deleteProduct);

// Projects
router.get('/projects', isAuthenticated, adminController.getProjects);
router.get('/project', isAuthenticated, (req, res) => res.redirect('/admin/projects'));
router.post('/projects', isAuthenticated, upload.single('coverImage'), adminController.postAddProject);
router.get('/projects/:id/edit', isAuthenticated, adminController.getEditProject);
router.post('/projects/:id/edit', isAuthenticated, upload.single('coverImage'), adminController.postEditProject);
router.post('/projects/:id/delete', isAuthenticated, adminController.deleteProject);

// Services
router.get('/services', isAuthenticated, adminController.getServices);
router.post('/services', isAuthenticated, upload.single('image'), adminController.postAddService);
router.get('/services/:id/edit', isAuthenticated, adminController.getEditService);
router.post('/services/:id/edit', isAuthenticated, upload.single('image'), adminController.postEditService);
router.post('/services/:id/delete', isAuthenticated, adminController.deleteService);

// Testimonials
router.get('/testimonials', isAuthenticated, adminController.getTestimonials);
router.post('/testimonials', isAuthenticated, adminController.postAddTestimonial);
router.get('/testimonials/:id/edit', isAuthenticated, adminController.getEditTestimonial);
router.post('/testimonials/:id/edit', isAuthenticated, adminController.postEditTestimonial);
router.post('/testimonials/:id/delete', isAuthenticated, adminController.deleteTestimonial);

// Settings
router.get('/settings', isAuthenticated, adminController.getSettings);
router.post('/settings', isAuthenticated, adminController.postSettings);

module.exports = router;

