const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orgRoutes = require('./routes/organisations');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', orgRoutes);

app.use(errorHandler);

module.exports = app;
