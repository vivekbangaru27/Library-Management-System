// Backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/add-book', adminController.addBook);
router.get('/all-books', adminController.getAllBooks);
router.post('/return-request', adminController.handleReturnRequest);
router.get('/pending-requests', adminController.getPendingReturnRequests);
router.get('/recommendations', adminController.getRecommendations);

module.exports = router;
