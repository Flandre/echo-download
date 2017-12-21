const express = require('express')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const request = require('request')
const opn = require('opn')

const app = express();


opn('http://localhost:8233', {app: 'chrome'})

app.listen('8233', () => {
  console.log('server started')
  console.log('http://localhost:8233')
})

const getMusicSourceById = (musicId, callback) => {
  console.log(musicId)
  let options = {
    hostname: 'www.app-echo.com',
    port: 80,
    path: '/api/sound/info?id=' + musicId,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  http.get(options, (res) => {
    res.setEncoding('utf8')
    let status = res.statusCode
    if(status == 200){
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        callback(data)
      })
    } else {
      callback('error')
    }
  });
}

app.get('/getMusic', (req, res) => {
  let musicId = req.query.id
  getMusicSourceById(musicId, data => {
    res.send(data)
  })
});

app.get('/download', (req, res) => {
  let downloadPath = req.query.downloadPath, fileName = req.query.fileName
  if (!fs.existsSync(path.join(__dirname, 'download'))) {
    fs.mkdirSync(path.join(__dirname, 'download'));
  }
  request(downloadPath).pipe(fs.createWriteStream(path.join(__dirname, 'download', fileName)))
  res.send('ok')
})

app.get('/', (req, res) => {
  let data = fs.readFileSync('index.html', 'utf-8');
  res.send(data);
})


