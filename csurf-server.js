// csurf-server.js
const express = require('express');
const session = require('express-session');
const csurf = require('csurf');         /* another name of csrf */
const bodyParser = require('body-parser');

const app = express();
app.use(session({ secret: 'keyboard', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// initialize csurf middleware (requires session or cookie)
app.use(csurf());

app.get('/login', (req, res) => {
  req.session.user = 'user123';
  res.send('Logged in. <a href="/transfer">Go to transfer</a>');
});

app.get('/transfer', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  // embed CSRF token into the form
  res.send(`
    <h2>Bank (CSRF protected)</h2>
    <form method="POST" action="/transfer">
      <input name="to" value="alice" />
      <input name="amount" value="100" />
      <input type="hidden" name="_csrf" value="${req.csrfToken()}" />
      <button>Send</button>
    </form>
  `);
});

app.post('/transfer', (req, res) => {
  // csurf middleware will validate req.body._csrf automatically
  const { to, amount } = req.body;
  res.send(`Transferred ${amount} to ${to} (token valid)`);
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') return res.status(403).send('Invalid CSRF token');
  next(err);
});

app.listen(3001, () => console.log('CSRF-protected bank on http://localhost:3001'));


/* How to test

npm i express express-session csurf body-parser

node csurf-server.js

Visit http://localhost:3001/login, then http://localhost:3001/transfer to see the hidden token.

The previous attacker.html will NOT work against this server (token missing/invalid). */