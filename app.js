const express = require('express')
const fs = require('fs')
var path = require('path')
var http = require('http')
const opn = require('opn')

const app = express();


opn('http://localhost:8233', {app: 'chrome'})

app.listen('8233', function () {
  console.log('server started')
  console.log('http://localhost:8088')
})

function getMusicSourceById(musicId, res) {
  console.log(musicId)
  var options = {
    hostname: 'www.app-echo.com',
    port: 80,
    path: '/api/sound/info',
    query: {
      id: musicId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  };
  http.get(options, function (res) {
    console.log(Object.keys(res))
    console.log(res.req)
  });

}

app.get('/getMusic', function(req, res) {
  var querydata = req.query;
  var orderid = querydata.id;
  getMusicSourceById(orderid, res)
});

app.get('/', function (req, res) {
  var data = fs.readFileSync('index.html', 'utf-8');
  res.send(data);
})
