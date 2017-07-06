const path = require('path');
const fileUploadConfig = require('../config/file-upload-config').fileUploadConfig;
const handleDb = require('../db/handle-db');
const multer  = require('multer');

module.exports.initUploadPage = function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/video_upload_test.html'));
}

module.exports.uploadFile = function(req, res) {
  var upload = multer(fileUploadConfig).single('user-file');
  upload(req, res, function(uploadError){
    if(uploadError){
      var errorMessage;
      if(uploadError.code === 'LIMIT_FILE_TYPE') {
        errorMessage = uploadError.errorMessage;
      } else if(uploadError.code === 'LIMIT_FILE_SIZE'){
          errorMessage = 'Maximum file size allowed is ' + process.env.FILE_SIZE + 'MB';
      }
      return res.json({
        error: errorMessage
      });
    }
    const fileId = req.file.filename.split('-')[0];
    const link = 'http://' + req.hostname + ':' + process.env.PORT + '/video/' + fileId

    res.json({
      success: true,
      link: link
    });
    const attributesToBeSaved = {
      id: fileId,
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      encoding: req.file.encoding,
      details: req.body.details ? req.body.details : ''
    }
    handleDb.saveToDB(attributesToBeSaved);
    // return res.send(req.file);
  });
}
