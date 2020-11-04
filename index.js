const express = require('express');
const https = require('http');
const bp = require('body-parser');
const fs = require('fs');
const md5 = require("crypto-js/md5");
const app = express();

app.use(bp.json());
app.use(express.static('public'))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/pdf-cors', (req, res) => {
    const { file } = req.query;
    const fileHash = md5(file).words.join("").replace(/-/g, '');
    if(!file) {
        res.send({"file-error": "no file to read"});
        return;
    }

    if(fs.existsSync(`cache/${fileHash}.txt`)) {
        const stream = fs.createReadStream(`cache/${fileHash}.txt`);
        stream.on('open', _ => stream.pipe(res) )
        stream.on('end', _ => {
            res.end();
            console.log("CACHE: File reading done !");
        })
        return;
    }
    
    https.get(file)
        .on('response', response => {
        res.setHeader('Content-Length', response.headers["content-length"]);
        //Set headers to cache the recieved data
        res.set('Cache-Control', 'public, max-age=3600');
        response.on('data', data => {
            fs.appendFileSync(`cache/${fileHash}.txt`, data, "binary",{'flags': 'a+'});
            res.write(data);
        })
        response.on('end', _ => {
            res.end();
            console.log("API: File reading done !");
        })
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`listening on ${PORT}`));