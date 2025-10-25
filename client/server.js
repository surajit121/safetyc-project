const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Enable CORS for all routes to avoid cross-origin issues with Google bots
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Serve the built Vite app from the dist directory
app.use(express.static(distPath));

// Special route for sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const distSitemap = path.join(distPath, 'sitemap.xml');
  const publicSitemap = path.join(publicPath, 'sitemap.xml');
  const sitemapPath = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;

  console.log('Attempting to serve sitemap from:', sitemapPath);

  if (fs.existsSync(sitemapPath)) {
    res.header('Content-Type', 'application/xml');
    res.sendFile(sitemapPath);
  } else {
    console.error('Sitemap file not found at:', sitemapPath);
    res.status(404).send('Sitemap not found');
  }
});

// Special route for robots.txt
app.get('/robots.txt', (req, res) => {
  const distRobots = path.join(distPath, 'robots.txt');
  const publicRobots = path.join(publicPath, 'robots.txt');
  const robotsPath = fs.existsSync(distRobots) ? distRobots : publicRobots;

  console.log('Attempting to serve robots.txt from:', robotsPath);

  if (fs.existsSync(robotsPath)) {
    res.header('Content-Type', 'text/plain');
    res.sendFile(robotsPath);
  } else {
    console.error('Robots.txt file not found at:', robotsPath);
    res.status(404).send('Robots.txt not found');
  }
});

// Handle client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});