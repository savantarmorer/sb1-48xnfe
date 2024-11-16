const fs = require('fs');
const path = require('path');

// Ensure build directory exists
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Copy deployment files
const filesToCopy = [
  'netlify.toml',
  'robots.txt',
  '_redirects'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    fs.copyFileSync(
      path.join(__dirname, file),
      path.join(buildDir, file)
    );
  }
});

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://cepacplay.com/sitemap.xml`;

fs.writeFileSync(path.join(buildDir, 'robots.txt'), robotsTxt);

// Generate _redirects for Netlify
const redirects = `/*    /index.html   200`;
fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);