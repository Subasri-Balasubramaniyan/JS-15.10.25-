// stored-xss.js (vulnerable)
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

const messages = []; // in-memory store

app.get('/', (req, res) => {
  const list = messages.map(m => `<li>${m}</li>`).join('');
  res.send(`
    <h1>Message Board</h1>
    <form method="POST">
      <input name="msg" />
      <button>Post</button>
    </form>
    <ul>${list}</ul>
    <p>Try posting: <code>&lt;script&gt;alert('stored')&lt;/script&gt;</code></p>
  `);
});

app.post('/', (req, res) => {
  messages.push(req.body.msg || '');
  res.redirect('/');
});

app.listen(3000, () => console.log('Stored XSS demo at http://localhost:3000'));


/* Post <script>alert('stored')</script> — it gets saved and executed for any visitor. */