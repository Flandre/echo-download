const express = require('express')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const request = require('request')
const mkdirsSync = require('./lib/mkdirsSync')
const opn = require('opn')

const app = express();
app.use(express.static('public'))


opn('http://localhost:8233', {app: 'chrome'})

app.listen('8233', () => {
  console.log('server started')
  console.log('http://localhost:8233')
})

const getMusicSourceById = (musicId, callback) => {
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
  let downloadPath = req.query.downloadPath, fileName = req.query.fileName, downloadDir = req.query.downloadDir
  console.log(`download start: ${fileName}`)
  let dir = path.join(__dirname, 'download', downloadDir)
  if (!fs.existsSync(dir)) {
    mkdirsSync(dir);
  }
  request(downloadPath)
    .pipe(fs.createWriteStream(path.join(dir, fileName)))
    .on('close', function(){
      console.log(`download end: ${fileName}`)
      res.send('ok')
    });
})

app.get('/', (req, res) => {
  let data = fs.readFileSync('index.html', 'utf-8');
  res.send(data);
})


