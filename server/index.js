const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db');

const scrapeRoutes = require('./routes/scrape');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/scrape', scrapeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 4000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed", err);
  process.exit(1);
});
