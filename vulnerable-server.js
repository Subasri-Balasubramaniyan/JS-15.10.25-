// vulnerable-server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// simple "auth" (sets a cookie to simulate logged in user)
app.get('/login', (req, res) => {
  res.cookie('session', 'user123', { httpOnly: true });
  res.send('Logged in (session cookie set). <a href="/">Go</a>');
});

// state-changing endpoint (no CSRF protection!)
app.post('/transfer', (req, res) => {
  // NOTE: this blindly trusts the session cookie if present
  if (!req.cookies.session) return res.status(401).send('Not logged in');
  const { to, amount } = req.body;
  // simulate money transfer...
  res.send(`Transferred ${amount} to ${to} (no CSRF checks)`);
});

app.get('/', (req, res) => {
  res.send(`
    <h2>Bank (vulnerable)</h2>
    <form method="POST" action="/transfer">
      <input name="to" value="alice" />
      <input name="amount" value="100" />
      <button>Send</button>
    </form>
    <p>Login first: <a href="/login">/login</a></p>
  `);
});

app.listen(3000, () => console.log('Vulnerable bank on http://localhost:3000'));
