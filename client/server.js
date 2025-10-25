const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the built files
app.use(express.static(path.join(__dirname)));

// Special route for sitemap.xml with proper headers
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  console.log('Serving sitemap from:', sitemapPath);
  res.sendFile(sitemapPath);
});

// Special route for robots.txt with proper headers
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  console.log('Serving robots.txt from:', robotsPath);
  res.sendFile(robotsPath);
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});