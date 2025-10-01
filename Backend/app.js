// app.js
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();
const app = express();
app.use(express.json());

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
