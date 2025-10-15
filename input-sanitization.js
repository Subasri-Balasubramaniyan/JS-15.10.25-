// input-sanitization.js
const express = require("express");
const app = express();

// Simple sanitization function
function sanitizeInput(input) {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")   // Replace &
    .replace(/</g, "&lt;")    // Replace <
    .replace(/>/g, "&gt;")    // Replace >
    .replace(/"/g, "&quot;")  // Replace "
    .replace(/'/g, "&#39;");  // Replace '
}

app.get("/", (req, res) => {
  const name = sanitizeInput(req.query.name || "Guest");
  res.send(`<h2>Hello, ${name}!</h2>`);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


/* ▶️ How to Run

Save the code as input-sanitization.js

Open a terminal and run:

npm init -y
npm install express
node input-sanitization.js


Visit in browser:

http://localhost:3000/?name=<script>alert('Hacked')</script>

💡 Output

Without sanitization → it would show an alert box (XSS attack)

With sanitization → browser displays this safely: 
Hello, &lt;script&gt;alert('Hacked')&lt;/script&gt;!
*/