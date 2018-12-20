const fs = require('fs')
const path = require('path')
const https = require('https')
const request = require('request')
const mkdirsSync = require('./lib/mkdirsSync')
const MAX_REQUEST = 6
let requestCount = 0
let AllShipsObj = {}
let successCount = 0

const userAgents = [
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
  'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
]

const getKanVoice = (name) => {
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
  https.get(encodeURI(`https://zh.moegirl.org/舰队Collection:${name}`), res => {
    console.log('====' + name)
    let chunk = ''
    res.on('data', data => chunk += data)
    res.on('end', () => {
      let sp = chunk.split('id="台词')[1]
      if(sp){
        let table = sp.substring(sp.indexOf('<tbody>'), sp.indexOf('</tbody>'))
        let trs = table.split('</tr>')
        trs.pop()
        trs.shift()
        let voiceObj = [], tmpName = '', count = 1
        // console.log(trs)
        trs.forEach(tr => {
          let voiceName = tr.substring(tr.indexOf('<td') + 4, tr.indexOf('</td>')).trim()
          voiceName = voiceName.replace('<br />', ' ')
          if(voiceName.indexOf('rowspan') > -1){
            tmpName = ''
            count = 1
            voiceName = voiceName.substring(voiceName.indexOf('>') + 1)
            tmpName = voiceName
            voiceName = `${tmpName}(${count})`
            count ++
          } else {
            if(voiceName.indexOf('<span') > -1){
              voiceName = `${tmpName}(${count})`
              count ++
            } else {
              tmpName = ''
              count = 1
            }
          }
          try{
            let trsp = tr.split('audioFileUrl')[1].split('lrcFileUrl')[0], fileType = 'mp3'
            if(trsp){
              if(trsp.indexOf('Ogg') > -1){
                fileType = 'Ogg'
              }
              let voiceUrl = trsp.substring(trsp.indexOf('https'), trsp.indexOf(`.${fileType}`)) + `.${fileType}`
              voiceUrl = voiceUrl.split('\\').join('')
              voiceObj.push({
                name: name,
                voiceName: voiceName,
                url: voiceUrl,
                fileType: fileType
              })
            }
          } catch (e){
            console.log('====ERROR')
            console.log(tr)
          }
        })
        // console.log(voiceObj)
        AllShipsObj[name] = voiceObj
        requestCount --
        successCount ++
        if(successCount === KanNames.length){
          console.log(AllShipsObj)
          fs.writeFile('test.json', JSON.stringify(AllShipsObj, null, 4), 'utf8', (err) => {
            if (err) throw err;
            console.log('done');
          });
        }
        // voiceObj.forEach(obj => {
        //   let dir = path.join('download', voiceName), fileName = `${obj.voiceName}.mp3`
        //   if (!fs.existsSync(dir)) {
        //     mkdirsSync(dir);
        //   }
        //   try{
        //     request(obj.url)
        //       .pipe(fs.createWriteStream(path.join(dir, fileName)))
        //       .on('error', err => {
        //         console.log('--------')
        //         console.log(err)
        //       })
        //   } catch (e){
        //     console.log(e)
        //   }
        // })
      } else {
        console.log(`=== ${name} string split ===`)
        console.log(sp)
        console.log(chunk.indexOf('id="台词"'))
        getKanVoice(name)
      }
    })
  })
}

const waitRequest = name => {
  if(requestCount < MAX_REQUEST){
    requestCount ++
    getKanVoice(name)
  } else {
    setTimeout(() => {
      waitRequest(name)
    }, 1000)
  }
}

let arr = ['长门']

KanNames = ["金刚","比睿","榛名","雾岛","扶桑","山城","伊势","日向","长门","陆奥","大和","武藏","俾斯麦","利托里奥","罗马","衣阿华","厌战","甘古特","黎塞留","纳尔逊","赤城","加贺","苍龙","飞龙","翔鹤","瑞鹤","云龙","天城","葛城","大凤","齐柏林伯爵","天鹰","萨拉托加","无畏","皇家方舟","凤翔","龙骧","龙凤","大鲸","祥凤","瑞凤","飞鹰","隼鹰","千岁","千代田","铃谷","熊野","春日丸","神鹰","甘比尔湾","千岁","千代田","秋津洲","瑞穗","神威","特斯特长官","古鹰","加古","青叶","衣笠","妙高","那智","足柄","羽黑","高雄","爱宕","摩耶","鸟海","最上","三隈","铃谷","熊野","利根","筑摩","欧根亲王","扎拉","波拉","天龙","龙田","球磨","多摩","北上","大井","木曾","长良","五十铃","名取","由良","鬼怒","阿武隈","川内","神通","那珂","夕张","阿贺野","能代","矢矧","酒匂","大淀","哥特兰","香取","鹿岛","神风","朝风","春风","松风","旗风","睦月","如月","弥生","卯月","皋月","水无月","文月","长月","菊月","三日月","望月","吹雪","白雪","初雪","深雪","丛云","矶波","浦波","绫波","敷波","天雾","狭雾","胧","曙","涟","潮","晓","响","Верный","雷","电","初春","子日","若叶","初霜","白露","时雨","村雨","夕立","春雨","五月雨","海风","山风","江风","凉风","朝潮","大潮","满潮","荒潮","朝云","山云","霞","霰","阳炎","不知火","黑潮","亲潮","初风","雪风","天津风","时津风","浦风","矶风","滨风","谷风","野分","岚","萩风","舞风","秋云","夕云","卷云","风云","长波","高波","藤波","滨波","岸波","冲波","朝霜","早霜","清霜","岛风","秋月","照月","凉月","初月","Z1","Z3","西北风","西南风","杰维斯","塔什干","塞缪尔·B·罗伯茨","伊168","伊58","伊19","伊8","伊400","伊401","伊26","伊13","伊14","まるゆ","吕500","Luigi_Torelli","占守","国后","择捉","松轮","佐渡","对马","福江","日振","大东","秋津丸","明石","大鲸","龙凤","速吸","神威"]

KanNames.forEach((name, index) => {
  waitRequest(name)
})
