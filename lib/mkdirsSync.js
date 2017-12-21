const fs = require('fs')
const path = require('path')
module.exports = function(dirpath, mode = 0o777) {
  try {
    if (!fs.existsSync(dirpath)) {
      let pathtmp;
      dirpath.split(/[/\\]/).forEach( dirname => {
        if (pathtmp) {
          pathtmp = path.join(pathtmp, dirname);
        } else {
          pathtmp = dirname;
        }

        if (!fs.existsSync(pathtmp)) {
          if (!fs.mkdirSync(pathtmp, mode)) {
            return false;
          }
        }
      });
    }
    return true;
  } catch(e) {
    log.error("create director fail! path=" + dirpath +" errorMsg:" + e);
    return false;
  }
}