// models/dbModel.js
const db = require('../config/db');

// A function to retrieve a book by its ID
exports.getBookById = (bookId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Book WHERE book_number = ?', [bookId], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// A function to retrieve all books and their statuses
exports.getAllBooks = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Book', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// A function to create a new user
exports.createUser = (user) => {
  return new Promise((resolve, reject) => {
    const { userID, name, password, email, phone, dept } = user;
    db.query(
      'INSERT INTO Member (userID, name, password, email, phone, dept) VALUES (?, ?, ?, ?, ?, ?)',
      [userID, name, password, email, phone, dept],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// A function to check if a user exists by their ID
exports.getUserById = (userID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Member WHERE userID = ?', [userID], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// Additional functions as needed, such as for borrowals, requests, etc.
