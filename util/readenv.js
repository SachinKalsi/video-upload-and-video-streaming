const fs = require('fs');

function setENV(str) {
    if(str) {
    var envArray = str.split('\n');
    envArray.forEach(function(item, i){
        if (item) {
            process.env[item.split('=')[0].trim()] = item.split('=')[1].trim();
        }

    });
    }
}

function config() {
var fileName = '.env';
    try {
        result = fs.readFileSync(fileName,{encoding: 'utf8'})
        setENV(result);
    }
    catch(error) {
        console.log('error : ', error);
    }
}

module.exports.config = config;
