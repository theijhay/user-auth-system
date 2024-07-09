const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orgRoutes = require('./routes/organisations');
const errorHandler = require('./middlewares/errorHandler');


dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', orgRoutes);

app.use(errorHandler);

module.exports = app;
