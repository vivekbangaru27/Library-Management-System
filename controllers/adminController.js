const db = require('../config/db');

exports.addBook = (req, res) => {
  const { title, author1, author2, publisher, date, tag, ISBN } = req.body;

  // Basic validation for required fields
  if (!title || !author1 || !publisher || !date || !ISBN) {
    return res.status(400).json({ error: 'All fields are required except for author2, tag.' });
  }

  const query = 'INSERT INTO books (title, author1, author2, publisher, date, tag, ISBN) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [title, author1, author2, publisher, date, tag, ISBN], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to add book. Please try again later.' });
    }
    res.status(201).json({ message: 'Book added successfully' });
  });
};

exports.getAllBooks = (req, res) => {
  const query = 'SELECT * FROM books';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to retrieve books. Please try again later.' });
    }
    res.status(200).json(results);
  });
};

exports.handleReturnRequest = (req, res) => {
  const { requestId, approved } = req.body; // `approved` can be true or false

  // Validate input
  if (!requestId || typeof approved !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid requestId and approved status.' });
  }

  const query = 'UPDATE borrowal SET status = ? WHERE id = ?';

  db.query(query, [approved ? 'Returned' : 'Pending', requestId], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to update return request. Please try again later.' });
    }
    res.status(200).json({ message: 'Return request updated successfully' });
  });
};

exports.getPendingReturnRequests = (req, res) => {
  const query = 'SELECT * FROM borrowal WHERE status = "Pending"';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to retrieve pending return requests. Please try again later.' });
    }
    res.status(200).json(results);
  });
};

exports.getRecommendations = (req, res) => {
  const query = 'SELECT * FROM recommendations';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to retrieve recommendations. Please try again later.' });
    }
    res.status(200).json(results);
  });
};
