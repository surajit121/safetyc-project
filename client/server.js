const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Serve the built Vite app
app.use(express.static(path.join(__dirname, '..')));

// Special route for sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  console.log('Attempting to serve sitemap from:', sitemapPath);
  
  // Check if file exists
  if (fs.existsSync(sitemapPath)) {
    console.log('Sitemap file found');
    res.header('Content-Type', 'application/xml');
    res.sendFile(sitemapPath);
  } else {
    console.error('Sitemap file not found at:', sitemapPath);
    res.status(404).send('Sitemap not found');
  }
});

// Special route for robots.txt
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  console.log('Attempting to serve robots.txt from:', robotsPath);
  
  // Check if file exists
  if (fs.existsSync(robotsPath)) {
    console.log('Robots.txt file found');
    res.header('Content-Type', 'text/plain');
    res.sendFile(robotsPath);
  } else {
    console.error('Robots.txt file not found at:', robotsPath);
    res.status(404).send('Robots.txt not found');
  }
});

// Handle client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});