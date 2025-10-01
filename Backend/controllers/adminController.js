// controllers/adminController.js
const db = require('../config/db');

exports.acceptRequest = (req, res) => {
  // Handle renewal request acceptance
  // Example query
  const { requestId } = req.body;
  db.query(
    'UPDATE Request SET status = 1 WHERE requestID = ?',
    [requestId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Request accepted' });
    }
  );
};

exports.viewBooks = (req, res) => {
  // View all books and statuses
  db.query('SELECT * FROM Book', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

exports.viewRecommendations = (req, res) => {
  // Get recommendations from users
  db.query('SELECT * FROM Request WHERE type = 1', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};
