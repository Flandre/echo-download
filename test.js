const request = require('request')
const fs = require('fs')
const path = require('path')

let count = 0


function getNextVideoClip() {
  request(`http://cntv.hls.cdn.myqcloud.com/asp/hls/850/0303000a/3/default/86eca35d438740d8b9012cec2a1325c4/${count}.ts`)
    .pipe(fs.createWriteStream(path.join('./', 'test.ts'), {'flags': 'a'}))
    .on('error', err => {
      console.log(err)
    })
    .on('close', function(){
      console.log(`download ${count} end`)
      // res.send('ok')
      count ++
      getNextVideoClip()
    });
}
getNextVideoClip()