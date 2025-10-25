import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

const projectRoot = process.cwd();
const distPath = path.join(projectRoot, 'dist');
const publicPath = path.join(projectRoot, 'public');

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
  const candidatePaths = [
    path.join(distPath, 'sitemap.xml'),
    path.join(publicPath, 'sitemap.xml'),
    path.join(projectRoot, 'sitemap.xml')
  ];

  const sitemapPath = candidatePaths.find(fs.existsSync);

  if (sitemapPath) {
    res.header('Content-Type', 'application/xml');
    return res.sendFile(sitemapPath);
  }

  console.error('Sitemap file not found in any known location');
  res.status(404).send('Sitemap not found');
});

// Special route for robots.txt
app.get('/robots.txt', (req, res) => {
  const candidatePaths = [
    path.join(distPath, 'robots.txt'),
    path.join(publicPath, 'robots.txt'),
    path.join(projectRoot, 'robots.txt')
  ];

  const robotsPath = candidatePaths.find(fs.existsSync);

  if (robotsPath) {
    res.header('Content-Type', 'text/plain');
    return res.sendFile(robotsPath);
  }

  console.error('Robots.txt file not found in any known location');
  res.status(404).send('Robots.txt not found');
});

// Handle client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});