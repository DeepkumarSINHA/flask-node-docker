const express = require('express');
const fetch = require('node-fetch'); // v2 compatible
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse form and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static (if any) from /public
app.use('/static', express.static(path.join(__dirname, 'public')));

// Home page — shows index.ejs with form
app.get('/', (req, res) => {
  res.render('index');
});

// Submit route — receives form data from browser, forwards JSON to Flask backend
app.post('/submit', async (req, res) => {
  try {
    // req.body is from the form (express.urlencoded)
    const payload = req.body || {};

    // Forward JSON to Flask using Docker internal hostname 'backend:5000'
    const resp = await fetch('http://backend:5000/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // If Flask returns non-JSON or error, handle gracefully
    const json = await resp.json();
    res.render('result', { backendData: json, formData: payload });
  } catch (err) {
    console.error('Error contacting backend:', err);
    res.status(500).send('Error contacting backend: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend running on ${PORT}`));
