// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/accept-request', adminController.acceptRequest);
router.get('/books', adminController.viewBooks);
router.get('/recommendations', adminController.viewRecommendations);

module.exports = router;
