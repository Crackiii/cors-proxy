const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
    console.log("REQUEST MADE");
  request(
    { url: 'https://www.mazda.com/' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      res.json(body);
    }
  )
});

const PORT = process.env.PORT || 8003;
app.listen(process.env.PORT, () => console.log(`listening on ${PORT}`));