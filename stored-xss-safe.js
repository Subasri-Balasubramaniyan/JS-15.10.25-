// stored-xss-safe.js
const express = require('express');
const sanitizeHtml = require('sanitize-html');
const app = express();
app.use(express.urlencoded({ extended: true }));

const messages = [];

app.get('/', (req, res) => {
  const list = messages.map(m => `<li>${m}</li>`).join('');
  res.send(`
    <h1>Message Board (sanitized)</h1>
    <form method="POST">
      <input name="msg" />
      <button>Post</button>
    </form>
    <ul>${list}</ul>
  `);
});

app.post('/', (req, res) => {
  // sanitize: strip script tags and other dangerous markup
  const clean = sanitizeHtml(req.body.msg || '', { allowedTags: [], allowedAttributes: {} });
  messages.push(clean);
  res.redirect('/');
});

app.listen(3000, () => console.log('Stored XSS fixed demo at http://localhost:3000'));


/* It uses sanitixe html 
this is the command to install sanititixe html   npm i sanitize-html
sanitize-html removes harmful tags — stored payloads will not execute. */