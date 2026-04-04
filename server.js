require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Main Root Route (Optional but good)
app.get('/', (req, res) => {
  res.send('Bookworm Inventories API is running...');
});

// Mounting Book Routes at /api/books
app.use('/api/books', bookRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");
  // Starting the server only after successful DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1); // Exit process with failure
});
