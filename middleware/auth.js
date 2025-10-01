// middlewares/auth.js
const dbModel = require('../models/dbModel');

// Middleware to check if a user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userID) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized access' });
  }
};

// Login function for users
exports.login = async (req, res) => {
  const { userID, password } = req.body;
  try {
    const user = await dbModel.getUserById(userID);
    if (user && user.password === password) { // In production, compare hashed passwords
      req.session.userID = userID;
      res.send({ message: 'Login successful' });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Logout function
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send({ message: 'Failed to log out' });
    else res.send({ message: 'Logout successful' });
  });
};
