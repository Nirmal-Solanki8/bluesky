const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Pages
router.get('/', publicController.getHome);
router.get('/about', publicController.getAbout);
router.get('/services', publicController.getServices);
router.get('/products', publicController.getProducts);
router.get('/product', publicController.getProducts);
router.get('/gallery', publicController.getGallery);
router.get('/projects', publicController.getGallery);
router.get('/project', publicController.getGallery);
router.get('/contact', publicController.getContact);

// Pool types
router.get('/pool-types', publicController.getPoolTypes);
router.get('/private-swimming-pools', publicController.getPrivatePools);
router.get('/commercial-swimming-pools', (req, res) => res.redirect('/pool-types#commercial'));
router.get('/recreational-swimming-pools', (req, res) => res.redirect('/pool-types#recreational'));
router.get('/competition-swimming-pools', (req, res) => res.redirect('/pool-types#competition'));
router.get('/vanishing-edge-swimming-pools', (req, res) => res.redirect('/pool-types#vanishing'));
router.get('/overflow-type-swimming-pools', (req, res) => res.redirect('/pool-types#overflow'));
router.get('/skimmer-type-swimming-pools', (req, res) => res.redirect('/pool-types#skimmer'));
router.get('/readymade-frp-swimming-pools', (req, res) => res.redirect('/pool-types#frp'));

// Inquiry
router.post('/inquiry', publicController.submitInquiry);

module.exports = router;

