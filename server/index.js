const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db');

const scrapeRoutes = require('./routes/scrape');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();
const path = require('path');

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/scrape', scrapeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Serve static assets from React client build
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initDb().then(() => {
  console.log("Database initialized successfully.");
}).catch(err => {
  console.warn("⚠️ Warning: Database connection failed. Running in static catalog mode.", err.message);
});
