// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/issued-books', userController.viewIssuedBooks);
router.get('/search-books', userController.searchBooks);
router.post('/send-recommendation', userController.sendRecommendation);

module.exports = router;
