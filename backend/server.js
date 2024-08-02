const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const schedule = require('node-schedule');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const stationeryRoutes = require('./routes/stationeryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const bankRoutes = require('./routes/bankRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', stationeryRoutes);submit
app.use('/api/locations', locationRoutes);
app.use('/api', bankRoutes);

// Serve the main React app for any route not handled by the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Schedule task to run daily at midnight
schedule.scheduleJob('0 0 * * *', async () => {
  const Book = require('./models/bookModel');
  try {
    const updatedRows = await Book.transferPreorderStock();
    console.log(`Transferred preorder stock for ${updatedRows} books`);
  } catch (error) {
    console.error('Error transferring preorder stock:', error);
  }
});
