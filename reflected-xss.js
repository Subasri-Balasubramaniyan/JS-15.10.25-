// reflected-xss.js (vulnerable)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // WARNING: directly echoing user input into HTML → reflected XSS
  const name = req.query.name || 'Guest';
  res.send(`
    <h1>Welcome</h1>
    <p>Hello, ${name}!</p>
    <p>Try: ?name=<script>alert('XSS')</script></p>
  `);
});

app.listen(3000, () => console.log('Reflected XSS demo at http://localhost:3000'));
