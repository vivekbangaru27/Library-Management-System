// controllers/userController.js
const { render } = require('ejs');
const db = require('../config/db');
const session = require('express-session');

exports.login = (req, res) => {
  const { userID, password } = req.body;
  console.log("login POST req");

  db.query(
    'SELECT * FROM Member WHERE userID = ? AND password = ?',
    [userID, password],
    (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length) {
        // Store user details in the session
        req.session.user = {
          userID: results[0].userID,
          name: results[0].name,
          email: results[0].email,
        };
        
        console.log( "login successful " ) ; 
        // Send a response indicating login success
        res.status(200).send({ message: 'Login successful' });  // Or you can redirect here instead
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    }
  );
};


exports.register = (req, res) => {
  // Extract data from the request body
  const { userID, name, password, email, phone, dept } = req.body;

  // Log for debugging (optional)
  console.log("Registering user", name);  // Use console.log instead of console.lost

  // Insert the new user into the database
  db.query(
      'INSERT INTO Member (userID, name, password, email, phone, dept) VALUES (?, ?, ?, ?, ?, ?)',
      [userID, name, password, email, phone, dept],
      (err, result) => {
          if (err) {
              return res.status(500).json({ message: 'Database error occurred', error: err });
          }
          // Send success response
          return res.json({ message: 'Registration successful' });
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


