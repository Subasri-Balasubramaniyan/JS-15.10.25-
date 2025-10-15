// reflected-xss-safe.js
const express = require('express');
const app = express();

// simple escape function
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

app.get('/', (req, res) => {
  const name = req.query.name ? escapeHtml(req.query.name) : 'Guest';
  res.send(`
    <h1>Welcome</h1>
    <p>Hello, ${name}!</p>
  `);
});

app.listen(3000, () => console.log('Fixed reflected XSS demo at http://localhost:3000'));
