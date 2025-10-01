const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Make sure this is the correct username
  password: '1245',       // Replace with your actual password
  database: 'LibraryManagement'  // Replace with your actual database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Export the connection object= 
module.exports = connection;
