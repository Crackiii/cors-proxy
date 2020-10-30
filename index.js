const express = require('express');
const request = require('request');
const https = require('https');
const bp = require('body-parser');
const app = express();

app.use(bp.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/pdf-cors', (req, res) => {
    const {file} = req.query;
    if(!file) {
        res.send({"file-error": "no file to read"});
        return;
    }
    
    https.get(file)
        .on('response', response => {
        res.setHeader('Content-Length', response.headers["content-length"])
        response.on('data', data => {
            res.write(data);
        })
        response.on('end', _ => {
            res.end();
            console.log("File reading done !");
        })
    })
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));