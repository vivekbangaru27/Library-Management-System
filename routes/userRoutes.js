// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for login page (render the login view instead of sending a string)
router.get('/', (req, res) => {
  res.render('login_signup'); // This will render 'login.ejs' from the views folder
});

router.get('/home', (req, res) => {
  res.render('home', { user: req.session.user }); // Pass the session data to the view
});

// POST request for login
router.post('/login', userController.login);

// POST request for registration
router.post('/register', userController.register);

// GET request for searching books
router.get('/search-books', userController.searchBooks);

// GET request for viewing issued books
router.get('/view-issued-books', userController.viewIssuedBooks);

// POST request for sending book recommendation
router.post('/send-recommendation', userController.sendRecommendation);

module.exports = router;
