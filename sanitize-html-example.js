const express = require("express");
const sanitizeHtml = require("sanitize-html");
const app = express();

app.use(express.urlencoded({ extended: true }));

// Route for form submission
app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/">
      <textarea name="content" rows="4" cols="40" placeholder="Enter HTML here..."></textarea><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/", (req, res) => {
  const dirty = req.body.content;

  // Sanitize input: only allow a few safe tags
  const clean = sanitizeHtml(dirty, {
    allowedTags: ["b", "i", "em", "strong", "a"],
    allowedAttributes: {
      a: ["href"]
    }
  });

  res.send(`
    <h3>Sanitized Output:</h3>
    <div style="border:1px solid #ccc;padding:10px;">
      ${clean}
    </div>
    <hr>
    <a href="/">Go Back</a>
  `);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
