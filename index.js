const express = require('express');
const request = require('request');

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/', (req, res) => {
  request(
    { url: 'https://www.mazda.com/globalassets/en/assets/csr/download/2017/2017_all.pdf' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      res.json(body);
    }
  )
});

app.post("/test", (req, res) => {
    res.send({success: true});
})

app.get('/test', (req, res) => {
    res.send("Application is deployed!!")
  });

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));