// controllers/userController.js
const db = require('../config/db');

exports.login = (req, res) => {
  // Handle user login
  const { userID, password } = req.body;
  db.query(
    'SELECT * FROM Member WHERE userID = ? AND password = ?',
    [userID, password],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length) res.send({ message: 'Login successful' });
      else res.status(401).send({ message: 'Invalid credentials' });
    }
  );
};

exports.register = (req, res) => {
  // Handle new user registration
  const { userID, name, password, email, phone, dept } = req.body;
  db.query(
    'INSERT INTO Member (userID, name, password, email, phone, dept) VALUES (?, ?, ?, ?, ?, ?)',
    [userID, name, password, email, phone, dept],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Registration successful' });
    }
  );
};

exports.viewIssuedBooks = (req, res) => {
  // Show currently issued books for the user
  const { userID } = req.query;
  db.query(
    'SELECT * FROM Borrowal WHERE userID = ?',
    [userID],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
};

exports.searchBooks = (req, res) => {
  // Search for books by name
  const { book_name } = req.query;
  db.query(
    'SELECT * FROM Book_Details WHERE book_name LIKE ?',
    [`%${book_name}%`],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    }
  );
};

exports.sendRecommendation = (req, res) => {
  // User sends a book recommendation
  const { userID, book_name } = req.body;
  db.query(
    'INSERT INTO Request (userID, book_name, type) VALUES (?, ?, 1)',
    [userID, book_name],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Recommendation sent' });
    }
  );
};
