const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');

function processSSI(content) {
  return content.replace(/<!--#include virtual="([^"]+)" -->/g, (match, filePath) => {
    const fullPath = path.join(__dirname, filePath);
    try {
      return fs.readFileSync(fullPath, 'utf8');
    } catch (e) {
      return `<!-- include failed: ${filePath} -->`;
    }
  });
}

browserSync.init({
  server: {
    baseDir: './',
    middleware: [
      function (req, res, next) {
        const url = req.url.split('?')[0];
        const file = url === '/' ? '/index.html' : url;

        if (file.endsWith('.html')) {
          const filePath = path.join(__dirname, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.end(processSSI(content));
            return;
          } catch (e) {}
        }
        next();
      }
    ]
  },
  port: 3000,
  watch: true,
  notify: false
});
